
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Get session ID from query params if this is coming from a redirect
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Initialize Supabase with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Initialize regular Supabase client for user operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Get the user
    let userId: string | null = null;
    let userEmail: string | null = null;
    
    // First try to get user from the request auth header
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      
      if (!userError && userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email;
        logStep("User identified from auth header", { userId, userEmail });
      }
    }
    
    // If we have a session ID but no user yet, try to get user from the session
    if (sessionId && (!userId || !userEmail)) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          if (subscription && subscription.metadata && subscription.metadata.user_id) {
            userId = subscription.metadata.user_id;
            logStep("User identified from session metadata", { userId });
            
            // Get user email from Supabase
            const { data: userData, error: userError } = await supabaseAdmin
              .from("profiles")
              .select("email")
              .eq("id", userId)
              .maybeSingle();
              
            if (!userError && userData) {
              userEmail = userData.email;
              logStep("User email retrieved from profile", { userEmail });
            }
          }
        }
      } catch (error) {
        logStep("Error retrieving session", { error: String(error) });
      }
    }
    
    // If we still don't have a user, we can't proceed
    if (!userId) {
      logStep("No authenticated user found");
      return new Response(JSON.stringify({ 
        success: false,
        subscribed: false,
        plan: null,
        error: "No authenticated user found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    
    try {
      // Check if user profile exists, if not create it
      const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
        
      if (profileCheckError) {
        logStep("Error checking for profile", { error: profileCheckError.message });
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        logStep("Profile doesn't exist, creating one", { userId, email: userEmail });
        
        // Create a new profile for the user
        const { error: createProfileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: userId,
            email: userEmail,
            is_subscribed: false,
            updated_at: new Date().toISOString()
          });
          
        if (createProfileError) {
          logStep("Error creating profile", { error: createProfileError.message });
          return new Response(JSON.stringify({ 
            success: false,
            subscribed: false,
            plan: null,
            error: "Failed to create user profile" 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
        
        logStep("Profile created successfully", { userId });
      } else {
        logStep("Profile found", { hasStripeId: !!existingProfile.stripe_customer_id });
      }
      
      // Now get the profile (either existing or newly created)
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
        
      if (profileError) {
        logStep("Error fetching profile after creation check", { error: profileError.message });
        return new Response(JSON.stringify({ 
          success: false,
          subscribed: false,
          plan: null,
          error: "Failed to fetch user profile" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      if (!profile) {
        logStep("No profile found even after creation attempt", { userId });
        return new Response(JSON.stringify({ 
          success: false,
          subscribed: false,
          plan: null,
          error: "User profile issue persists" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      // If we have a specific session to check
      if (sessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          
          if (session.payment_status === "paid" && session.status === "complete") {
            // Session is paid and complete
            if (session.subscription) {
              const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
              const planId = subscription.metadata?.plan_id;
              
              if (planId) {
                // Get plan details
                const { data: plan, error: planError } = await supabaseAdmin
                  .from("plans")
                  .select("*")
                  .eq("id", planId)
                  .maybeSingle();
                  
                if (planError) {
                  logStep("Error fetching plan", { error: planError.message });
                  return new Response(JSON.stringify({ 
                    success: false,
                    subscribed: true,
                    plan: null,
                    error: "Subscription active but plan details unavailable" 
                  }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                  });
                }
                  
                if (plan) {
                  // Update profile with subscription status
                  const currentPeriodEnd = subscription.current_period_end 
                    ? new Date(subscription.current_period_end * 1000).toISOString() 
                    : null;
                  
                  const { error: updateError } = await supabaseAdmin
                    .from("profiles")
                    .update({
                      is_subscribed: true,
                      plan_id: planId,
                      subscription_id: subscription.id,
                      subscription_status: subscription.status,
                      subscription_end: currentPeriodEnd,
                      updated_at: new Date().toISOString(),
                    })
                    .eq("id", userId);
                    
                  if (updateError) {
                    logStep("Error updating profile with subscription", { error: updateError.message });
                  } else {
                    logStep("Updated profile with subscription info", { 
                      planId, 
                      isSubscribed: true,
                      subscriptionEnd: currentPeriodEnd
                    });
                  }
                  
                  return new Response(JSON.stringify({ 
                    success: true,
                    subscribed: true,
                    plan: plan,
                  }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                  });
                }
              } else {
                logStep("No plan ID found in subscription metadata");
                return new Response(JSON.stringify({ 
                  success: true,
                  subscribed: true,
                  plan: { name: "Unknown Plan" }, // Fallback plan name
                  error: "Plan details not found but subscription is active"
                }), {
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                  status: 200,
                });
              }
            }
          } else {
            logStep("Session not complete", { 
              paymentStatus: session.payment_status, 
              status: session.status 
            });
          }
        } catch (error) {
          logStep("Error retrieving session details", { error: String(error) });
        }
      }
      
      // If we get here, either there was no session ID or the session check failed
      // Fall back to checking current subscription status
      
      // Check for customer in Stripe
      if (!profile.stripe_customer_id) {
        // Try to find customer by email
        if (userEmail) {
          const customers = await stripe.customers.list({
            email: userEmail,
            limit: 1
          });
          
          if (customers.data.length > 0) {
            // Update profile with customer ID
            profile.stripe_customer_id = customers.data[0].id;
            const { error: updateError } = await supabaseAdmin
              .from("profiles")
              .update({ stripe_customer_id: profile.stripe_customer_id })
              .eq("id", userId);
            
            if (updateError) {
              logStep("Error updating customer ID in profile", { error: updateError.message });
            } else {
              logStep("Found and updated customer ID", { customerId: profile.stripe_customer_id });
            }
          } else {
            logStep("No Stripe customer ID found");
            return new Response(JSON.stringify({ 
              success: true,
              subscribed: false,
              plan: null
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }
        } else {
          logStep("No user email available to look up customer");
          return new Response(JSON.stringify({
            success: false,
            subscribed: false,
            plan: null,
            error: "No customer information available"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
      
      // Check for active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
        expand: ["data.default_payment_method"],
      });
      
      if (subscriptions.data.length === 0) {
        logStep("No active subscriptions found");
        
        // Update profile to indicate no subscription
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
          
        if (updateError) {
          logStep("Error updating profile with no subscription", { error: updateError.message });
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          subscribed: false,
          plan: null
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // We have an active subscription
      const subscription = subscriptions.data[0];
      const planId = subscription.metadata?.plan_id;
      
      if (!planId) {
        logStep("Subscription found but no plan ID in metadata");
        
        // Still update the profile as subscribed
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: true,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
          
        if (updateError) {
          logStep("Error updating profile with generic subscription", { error: updateError.message });
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          subscribed: true,
          plan: { name: "Premium Plan" } // Generic fallback name
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Get plan details
      const { data: plan, error: planError } = await supabaseAdmin
        .from("plans")
        .select("*")
        .eq("id", planId)
        .maybeSingle();
      
      if (planError) {
        logStep("Error fetching plan", { error: planError.message });
        
        // Still update the profile as subscribed even if plan details are missing
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: true,
            plan_id: planId,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
          
        if (updateError) {
          logStep("Error updating profile with subscription without plan", { error: updateError.message });
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          subscribed: true,
          plan: { name: "Premium Plan" }, // Generic fallback name
          error: "Plan details unavailable but subscription is active"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Update profile with subscription status
      const currentPeriodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null;
      
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          is_subscribed: true,
          plan_id: planId,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
        
      if (updateError) {
        logStep("Error updating profile with plan subscription", { error: updateError.message });
      } else {
        logStep("Updated profile with subscription info", { 
          planId, 
          isSubscribed: true,
          subscriptionEnd: currentPeriodEnd
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        subscribed: true,
        plan: plan,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (profileError) {
      logStep("Error processing profile data", { error: String(profileError) });
      return new Response(JSON.stringify({ 
        success: false,
        subscribed: false,
        plan: null,
        error: "Error processing user profile data"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500, 
      });
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error in check-subscription", { error: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
