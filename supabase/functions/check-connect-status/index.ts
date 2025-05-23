
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    const { accountId } = await req.json();
    
    if (!accountId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: accountId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Checking Stripe Connect account status for:", accountId);
    
    // Create Supabase client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Authenticated user:", user.id);
    
    // Get the current Stripe Connect account record
    const { data: existingAccount, error: fetchError } = await supabaseAdmin
      .from('stripe_connect_accounts')
      .select('*')
      .eq('stripe_account_id', accountId)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Database error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Error fetching account information" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (!existingAccount) {
      return new Response(
        JSON.stringify({ error: "Stripe Connect account not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });
    
    // Retrieve the current account status directly from Stripe
    console.log("Retrieving account from Stripe");
    const account = await stripe.accounts.retrieve(accountId);
    
    // Check if account status has changed
    const detailsSubmitted = account.details_submitted || false;
    const chargesEnabled = account.charges_enabled || false;
    const payoutsEnabled = account.payouts_enabled || false;
    
    const onboardingComplete = detailsSubmitted && chargesEnabled && payoutsEnabled;
    let updated = false;
    
    // Check if there are changes to update
    if (
      existingAccount.details_submitted !== detailsSubmitted ||
      existingAccount.charges_enabled !== chargesEnabled ||
      existingAccount.payouts_enabled !== payoutsEnabled ||
      existingAccount.onboarding_complete !== onboardingComplete
    ) {
      console.log("Account status has changed, updating database");
      
      // Update our records
      const { error: updateError } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .update({
          details_submitted: detailsSubmitted,
          charges_enabled: chargesEnabled,
          payouts_enabled: payoutsEnabled,
          onboarding_complete: onboardingComplete,
          account_details: account,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_account_id', accountId);
        
      if (updateError) {
        console.error("Error updating account status:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update account status" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      updated = true;
    } else {
      console.log("No changes to account status");
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        updated,
        status: {
          details_submitted: detailsSubmitted,
          charges_enabled: chargesEnabled, 
          payouts_enabled: payoutsEnabled,
          onboarding_complete: onboardingComplete
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in check-connect-status:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
