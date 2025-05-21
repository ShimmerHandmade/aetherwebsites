
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBSCRIPTION-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    logStep("ERROR: No signature provided");
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      logStep("ERROR: Missing STRIPE_WEBHOOK_SECRET");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify the event came from Stripe
    let event;
    try {
      logStep("Verifying Stripe signature");
      // Use constructEventAsync instead of constructEvent for Deno compatibility
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Signature verified successfully", { eventType: event.type });
    } catch (err) {
      logStep(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const metadata = subscription.metadata || {};
        const userId = metadata.user_id;
        const planId = metadata.plan_id;
        
        if (!userId || !planId) {
          logStep("ERROR: Missing user_id or plan_id in subscription metadata", metadata);
          break;
        }

        // Get customer's email for logging purposes
        const customer = await stripe.customers.retrieve(customerId);
        logStep(`Processing subscription event for user: ${customer.email}, Plan: ${planId}`);

        // Format timestamps to ISO strings properly
        const currentPeriodStart = subscription.current_period_start 
          ? new Date(subscription.current_period_start * 1000).toISOString() 
          : null;
          
        const currentPeriodEnd = subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : null;

        // Update profile with subscription status
        await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: subscription.status === "active",
            plan_id: planId,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_start: currentPeriodStart,
            subscription_end: currentPeriodEnd,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        logStep("Updated profile subscription status", {
          userId,
          isSubscribed: subscription.status === "active",
          start: currentPeriodStart,
          end: currentPeriodEnd
        });

        // Special handling for subscription cancellation/deletion
        if (event.type === "customer.subscription.deleted" || 
            subscription.status === "canceled" || 
            subscription.status === "incomplete_expired") {
          
          logStep("Subscription canceled or expired. Planning cleanup actions.", { 
            userId,
            subscription_status: subscription.status
          });
          
          // Allow a grace period before cleaning up data (7 days after end date)
          const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          const subscriptionEndTime = subscription.canceled_at || subscription.current_period_end;
          const gracePeriodEnd = new Date((subscriptionEndTime * 1000) + gracePeriodMs);
          
          // Schedule cleanup after grace period
          // For immediate testing, you can remove the timeout and just run the cleanup code
          logStep("Scheduling account cleanup after grace period", {
            userId,
            gracePeriodEnd: gracePeriodEnd.toISOString()
          });
          
          // Check if grace period has already ended
          if (new Date() >= gracePeriodEnd) {
            logStep("Grace period ended, cleaning up user data now", { userId });
            await cleanupUserData(supabaseAdmin, userId);
          } else {
            // Note: In a real production implementation, you would have a scheduled job
            // that checks for accounts where grace period has ended each day
            // For this implementation, we'll check on next login or webhook event
            await supabaseAdmin
              .from("profiles")
              .update({
                scheduled_cleanup_date: gracePeriodEnd.toISOString(),
              })
              .eq("id", userId);
            
            logStep("Set scheduled cleanup date", { 
              userId, 
              scheduledCleanup: gracePeriodEnd.toISOString()
            });
          }
        }

        if (event.type === "customer.subscription.created") {
          // Record subscription in history
          try {
            const { data: plan } = await supabaseAdmin
              .from("plans")
              .select("*")
              .eq("id", planId)
              .maybeSingle();

            if (plan) {
              const price = subscription.items.data[0].plan.interval === "month" 
                ? plan.monthly_price 
                : plan.annual_price;
                
              await supabaseAdmin.from("subscription_history").insert({
                user_id: userId,
                plan_id: planId,
                subscription_type: subscription.items.data[0].plan.interval === "month" ? "monthly" : "annual",
                amount_paid: price,
                currency: subscription.currency,
                status: subscription.status,
                start_date: currentPeriodStart,
                end_date: currentPeriodEnd,
              });
              
              logStep("Recorded subscription in history", { 
                userId, 
                planId, 
                status: subscription.status 
              });
            }
          } catch (historyErr) {
            logStep(`Error recording subscription history: ${historyErr.message}`);
          }
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata?.user_id;
          const planId = subscription.metadata?.plan_id;
          
          if (userId && planId) {
            logStep(`Payment succeeded for user: ${userId}, Plan: ${planId}`);
            
            // Format timestamp to ISO string properly
            const subscriptionEnd = subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null;
              
            // Update subscription_end date
            await supabaseAdmin
              .from("profiles")
              .update({
                is_subscribed: true,
                subscription_end: subscriptionEnd,
                scheduled_cleanup_date: null, // Clear any scheduled cleanup
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId);
              
            logStep("Updated subscription end date", { userId, subscriptionEnd });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata?.user_id;
          
          if (userId) {
            logStep(`Payment failed for user: ${userId}`);
            // Update the subscription status
            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: "payment_failed",
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId);
          }
        }
        break;
      }

      default:
        logStep(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true, event_type: event.type }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep(`ERROR handling webhook: ${errorMessage}`);
    return new Response(JSON.stringify({ error: "Internal server error", details: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

// Helper function to clean up user data when subscription expires
async function cleanupUserData(supabaseAdmin, userId: string) {
  try {
    logStep(`Starting data cleanup for user: ${userId}`);
    
    // Delete user's websites
    const { data: websites, error: websitesError } = await supabaseAdmin
      .from("websites")
      .select("id")
      .eq("owner_id", userId);
      
    if (websitesError) {
      logStep(`Error fetching websites for deletion: ${websitesError.message}`);
    } else if (websites && websites.length > 0) {
      // Delete products associated with each website
      for (const website of websites) {
        // Delete products for this website
        await supabaseAdmin
          .from("products")
          .delete()
          .eq("website_id", website.id);
          
        logStep(`Deleted products for website ${website.id}`);
      }
      
      // Delete the websites
      await supabaseAdmin
        .from("websites")
        .delete()
        .eq("owner_id", userId);
        
      logStep(`Deleted ${websites.length} websites for user ${userId}`);
    }
    
    // Delete subscription history
    await supabaseAdmin
      .from("subscription_history")
      .delete()
      .eq("user_id", userId);
      
    logStep(`Deleted subscription history for user ${userId}`);
    
    // Update profile to show account has been cleaned up
    await supabaseAdmin
      .from("profiles")
      .update({
        is_subscribed: false,
        data_cleaned: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
      
    logStep(`Marked profile as cleaned for user ${userId}`);
    
    return true;
  } catch (error) {
    logStep(`Error in cleanupUserData: ${error.message}`);
    return false;
  }
}
