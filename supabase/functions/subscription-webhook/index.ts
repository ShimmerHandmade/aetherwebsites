
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify the event came from Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
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
          console.error("Missing user_id or plan_id in subscription metadata", metadata);
          break;
        }

        // Get customer's email for logging purposes
        const customer = await stripe.customers.retrieve(customerId);
        console.log(`Processing subscription event for user: ${customer.email}, Plan: ${planId}`);

        // Update profile with subscription status
        await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: subscription.status === "active",
            plan_id: planId,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (event.type === "customer.subscription.created") {
          // Record subscription in history
          const { data: plan } = await supabaseAdmin
            .from("plans")
            .select("*")
            .eq("id", planId)
            .single();

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
              start_date: new Date(subscription.current_period_start * 1000).toISOString(),
              end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            });
          }
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata.user_id;
          const planId = subscription.metadata.plan_id;
          
          if (userId && planId) {
            console.log(`Payment succeeded for user: ${userId}, Plan: ${planId}`);
            
            // Update subscription_end date
            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const userId = subscription.metadata.user_id;
          
          if (userId) {
            console.log(`Payment failed for user: ${userId}`);
            // You could notify the user or take other actions here
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
