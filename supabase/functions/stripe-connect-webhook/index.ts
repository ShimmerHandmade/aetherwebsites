
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import Stripe from "https://esm.sh/stripe@14.21.0"

// This webhook needs to be public (no JWT verification)
serve(async (req) => {
  try {
    const stripeSignature = req.headers.get('stripe-signature');
    
    if (!stripeSignature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });
    
    const webhookSecret = Deno.env.get("STRIPE_CONNECT_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get request body as text for signature verification
    const body = await req.text();
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, stripeSignature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Received Stripe Connect event: ${event.type}`);
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Handle specific events
    if (event.type === 'account.updated') {
      const account = event.data.object;
      
      // Check if this is a connect account we have in our database
      const { data: connectAccount, error: connectError } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .select('*')
        .eq('stripe_account_id', account.id)
        .maybeSingle();
      
      if (connectError) {
        console.error("Error finding connect account:", connectError);
        return new Response(JSON.stringify({ error: "Database error" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (!connectAccount) {
        console.log(`Connect account ${account.id} not found in database, ignoring`);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Check if onboarding is complete
      const onboardingComplete = 
        account.details_submitted && 
        account.charges_enabled && 
        account.payouts_enabled;
      
      // Update our database with the latest account status
      const { error: updateError } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .update({
          onboarding_complete: onboardingComplete,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
          account_details: account,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_account_id', account.id);
      
      if (updateError) {
        console.error("Error updating connect account:", updateError);
        return new Response(JSON.stringify({ error: "Database update error" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Updated Connect account ${account.id}, onboarding complete: ${onboardingComplete}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
