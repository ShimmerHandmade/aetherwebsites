
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
    const { websiteId, returnUrl } = await req.json();
    
    if (!websiteId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: websiteId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Creating Stripe Connect account for website:", websiteId);
    
    // Create Supabase client
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
    
    // Verify that the user owns the website
    const { data: website, error: websiteError } = await supabaseAdmin
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .eq('owner_id', user.id)
      .single();
    
    if (websiteError || !website) {
      console.error("Website verification error:", websiteError);
      return new Response(
        JSON.stringify({ error: "Website not found or you don't have permission" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });
    
    console.log("Checking for existing Stripe Connect account");
    
    // Check if website already has a Stripe account
    const { data: existingConnect, error: connectError } = await supabaseAdmin
      .from('stripe_connect_accounts')
      .select('stripe_account_id, onboarding_complete')
      .eq('website_id', websiteId)
      .maybeSingle();
    
    if (connectError) {
      console.error("Database error:", connectError);
      return new Response(
        JSON.stringify({ error: "Error checking existing connect account" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    let accountId;
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const defaultReturnUrl = `${origin}/builder/${websiteId}/payment-settings`;
    const finalReturnUrl = returnUrl || defaultReturnUrl;
    
    if (existingConnect?.stripe_account_id) {
      // If account exists but onboarding not complete, create a new onboarding link
      accountId = existingConnect.stripe_account_id;
      console.log(`Using existing Stripe account: ${accountId}`);
    } else {
      try {
        // Create a new Connect account
        console.log("Creating new Stripe Connect account");
        const account = await stripe.accounts.create({
          type: 'standard',
          email: user.email,
          metadata: {
            websiteId,
            userId: user.id
          }
        });
        
        accountId = account.id;
        console.log("Stripe account created:", accountId);
        
        // Store the Connect account in our database
        const { error: insertError } = await supabaseAdmin
          .from('stripe_connect_accounts')
          .insert({
            website_id: websiteId,
            user_id: user.id,
            stripe_account_id: accountId,
            account_type: 'standard',
            onboarding_complete: false,
            account_details: account
          });
        
        if (insertError) {
          console.error("Error storing Connect account:", insertError);
          return new Response(
            JSON.stringify({ error: "Failed to store Connect account information" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } catch (stripeError: any) {
        console.error("Stripe error creating account:", stripeError);
        return new Response(
          JSON.stringify({ error: "Failed to create Stripe account", details: stripeError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }
    
    try {
      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: finalReturnUrl,
        return_url: finalReturnUrl,
        type: 'account_onboarding',
      });
      
      console.log("Created account link with URL:", accountLink.url);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          url: accountLink.url,
          accountId
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (linkError: any) {
      console.error("Error creating account link:", linkError);
      return new Response(
        JSON.stringify({ error: "Failed to create onboarding link", details: linkError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in create-connect-account:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
