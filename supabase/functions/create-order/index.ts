
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
  quantity: number;
}

interface OrderRequest {
  items: CartItem[];
  websiteId: string;
  customerInfo?: {
    email: string;
    name: string;
    phone?: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string; // e.g., "cod" (cash on delivery), "stripe", etc.
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    const { items, websiteId, customerInfo, shippingAddress, billingAddress, paymentMethod, notes } = await req.json() as OrderRequest;
    
    if (!items || !items.length || !websiteId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: items, websiteId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Calculate order total
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get user from auth header if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      userId = user?.id;
    }
    
    // Check if this website has a Stripe Connect account for online payments
    let stripeConnectAccountId = null;
    
    if (paymentMethod === "stripe") {
      const { data: connectAccount, error: connectError } = await supabaseAdmin
        .from('stripe_connect_accounts')
        .select('stripe_account_id, onboarding_complete, charges_enabled')
        .eq('website_id', websiteId)
        .eq('onboarding_complete', true)
        .eq('charges_enabled', true)
        .maybeSingle();
      
      if (connectError) {
        console.error("Error checking for Stripe Connect account:", connectError);
      } else if (connectAccount) {
        stripeConnectAccountId = connectAccount.stripe_account_id;
        console.log(`Using Stripe Connect account: ${stripeConnectAccountId}`);
      } else {
        // No valid Stripe Connect account, fall back to COD
        console.log(`No valid Stripe Connect account for website ${websiteId}, falling back to COD`);
        paymentMethod = "cod";
      }
    }
    
    // Start a transaction to create order and order items
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        website_id: websiteId,
        total_amount: totalAmount,
        shipping_address: shippingAddress || null,
        billing_address: billingAddress || null,
        payment_info: {
          method: paymentMethod,
          customer_info: customerInfo,
          notes: notes || null,
          stripe_connect_account_id: stripeConnectAccountId
        },
        status: paymentMethod === "cod" ? "pending" : "awaiting_payment"
      })
      .select()
      .single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order", details: orderError }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price
    }));
    
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);
    
    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Try to delete the order if items failed
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      
      return new Response(
        JSON.stringify({ error: "Failed to create order items", details: itemsError }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // If using Stripe payment, create a checkout session
    if (paymentMethod === "stripe" && stripeConnectAccountId) {
      // Initialize Stripe
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
        apiVersion: "2023-10-16",
      });
      
      const origin = req.headers.get('origin') || 'http://localhost:3000';
      
      // Format line items for Stripe
      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: item.product.image_url ? [item.product.image_url] : undefined,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));
      
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/order-confirmation?order_id=${order.id}`,
        cancel_url: `${origin}/checkout?canceled=true`,
        customer_email: customerInfo?.email,
        metadata: {
          order_id: order.id,
          website_id: websiteId,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU'],
        },
        stripe_account: stripeConnectAccountId,
      });
      
      // Update order with Stripe session information
      await supabaseAdmin
        .from("orders")
        .update({
          payment_info: {
            ...order.payment_info,
            stripe_session_id: session.id
          }
        })
        .eq("id", order.id);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order created successfully",
          order: { 
            id: order.id, 
            total: totalAmount,
            status: order.status
          },
          checkout_url: session.url
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // For COD or if no Stripe account is available
    return new Response(
      JSON.stringify({
        success: true,
        message: "Order created successfully",
        order: { 
          id: order.id, 
          total: totalAmount,
          status: order.status
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process order", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
