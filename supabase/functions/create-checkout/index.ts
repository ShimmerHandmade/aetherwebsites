
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    const { billing_type, plan_id } = await req.json();
    
    // Validate input
    if (!billing_type || !plan_id) {
      throw new Error("Missing required fields: billing_type or plan_id");
    }
    
    if (billing_type !== 'monthly' && billing_type !== 'annual') {
      throw new Error("Invalid billing_type. Must be 'monthly' or 'annual'");
    }
    
    logStep("Input validated", { billing_type, plan_id });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single();
    
    if (planError || !plan) {
      throw new Error(`Failed to fetch plan: ${planError?.message || "Plan not found"}`);
    }
    logStep("Plan retrieved", { planName: plan.name });

    // Check if customer exists, otherwise create one
    let customerId: string;
    const { data: customer } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    
    if (customer && customer.length > 0) {
      customerId = customer[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      });
      customerId = newCustomer.id;
      logStep("New customer created", { customerId });

      // Update profile with customer ID
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Create subscription price
    const price = billing_type === 'monthly' ? plan.monthly_price : plan.annual_price;
    const priceId = billing_type === 'monthly' ? 
      plan.stripe_monthly_price_id : 
      plan.stripe_annual_price_id;

    // Create a checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        priceId ?
          { price: priceId, quantity: 1 } :
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.name} Plan (${billing_type === 'monthly' ? 'Monthly' : 'Annual'})`,
                description: plan.description || `${plan.name} subscription plan`,
              },
              unit_amount: price,
              recurring: {
                interval: billing_type === 'monthly' ? 'month' : 'year',
              },
            },
            quantity: 1,
          },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_id: plan_id,
          plan_name: plan.name,
        },
      },
      success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in create-checkout:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
