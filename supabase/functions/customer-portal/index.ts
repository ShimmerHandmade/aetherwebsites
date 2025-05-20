
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profileError) {
      logStep("Error fetching profile", { error: profileError.message });
      throw new Error(`Failed to get profile: ${profileError.message}`);
    }
    
    const customerId = profile?.stripe_customer_id;
    
    // If no customer ID exists, create a Stripe customer for this user
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    let customerToUse = customerId;
    
    if (!customerToUse) {
      logStep("No existing Stripe customer ID found, creating new customer");
      
      try {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          name: profile?.full_name || user.email,
          metadata: {
            supabase_user_id: user.id
          }
        });
        
        customerToUse = newCustomer.id;
        
        // Update profile with new Stripe customer ID
        await supabaseClient
          .from("profiles")
          .update({ stripe_customer_id: customerToUse })
          .eq("id", user.id);
        
        logStep("Created and saved new Stripe customer", { customerId: customerToUse });
      } catch (err) {
        logStep("Error creating Stripe customer", { error: String(err) });
        throw new Error(`Failed to create Stripe customer: ${String(err)}`);
      }
    }
    
    if (!customerToUse) {
      throw new Error("Could not find or create a Stripe customer for this user");
    }
    
    logStep("Using Stripe customer ID", { customerId: customerToUse });
    
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerToUse,
      return_url: `${origin}/dashboard`,
    });
    
    logStep("Customer portal session created", { sessionId: portalSession.id, url: portalSession.url });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in customer-portal", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
