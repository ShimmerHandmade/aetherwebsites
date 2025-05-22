
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
    weight?: number | null;
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
  shippingMethod?: string; // e.g., "flat_rate", "weight_based", "free"
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    console.log("create-order function started");
    const { items, websiteId, customerInfo, shippingAddress, billingAddress, paymentMethod, shippingMethod, notes } = await req.json() as OrderRequest;
    
    console.log("Order request:", { websiteId, paymentMethod, itemsCount: items.length });
    
    if (!items || !items.length || !websiteId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: items, websiteId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
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
      console.log("Authenticated user:", userId);
    }
    
    // Calculate order total based on product prices
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    console.log("Order subtotal calculated:", subtotal);
    
    // Retrieve shipping settings and calculate shipping cost
    let shippingCost = 0;
    let effectiveShippingMethod = shippingMethod || 'flat_rate';
    
    try {
      // Fetch shipping settings for this website
      const { data: shippingSettings, error: shippingError } = await supabaseAdmin
        .from('shipping_settings')
        .select('*')
        .eq('website_id', websiteId)
        .single();
      
      if (shippingError) {
        console.error("Error fetching shipping settings:", shippingError);
      } else if (shippingSettings) {
        // Calculate shipping cost based on selected/default method and settings
        if (shippingSettings.free_shipping_enabled && subtotal >= shippingSettings.free_shipping_minimum) {
          // Free shipping qualification based on order subtotal
          shippingCost = 0;
          effectiveShippingMethod = 'free';
          console.log("Free shipping applied, order qualifies with subtotal:", subtotal);
        } else if (shippingMethod === 'weight_based' && shippingSettings.weight_based_enabled) {
          // Calculate total weight of items
          const totalWeight = items.reduce((sum, item) => {
            return sum + ((item.product.weight || 0) * item.quantity);
          }, 0);
          
          // Find applicable weight rate
          const weightRates = shippingSettings.weight_based_rates || [];
          const applicableRate = weightRates.find(
            rate => totalWeight >= rate.min_weight && totalWeight <= rate.max_weight
          );
          
          if (applicableRate) {
            shippingCost = applicableRate.rate;
            console.log(`Weight-based shipping applied: ${shippingCost} for weight ${totalWeight}`);
          } else {
            // Default to flat rate if no weight rate applies
            shippingCost = shippingSettings.flat_rate_amount || 0;
            effectiveShippingMethod = 'flat_rate';
            console.log(`No applicable weight rate, using flat rate: ${shippingCost}`);
          }
        } else if (shippingSettings.flat_rate_enabled) {
          // Default to flat rate
          shippingCost = shippingSettings.flat_rate_amount || 0;
          effectiveShippingMethod = 'flat_rate';
          console.log(`Flat rate shipping applied: ${shippingCost}`);
        }
      }
    } catch (error) {
      console.error("Error processing shipping:", error);
      // Continue with zero shipping if there's an error
    }
    
    // Calculate total amount including shipping
    const totalAmount = subtotal + shippingCost;
    console.log("Order total calculated:", totalAmount);
    
    // Check if this website has a Stripe Connect account for online payments
    let stripeConnectAccountId = null;
    
    if (paymentMethod === "stripe") {
      console.log("Checking for Stripe Connect account...");
      
      try {
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
      } catch (error) {
        console.error("Error checking for Stripe Connect account:", error);
        // Fall back to COD if there's an error
        paymentMethod = "cod";
      }
    }
    
    // Create the order
    try {
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          website_id: websiteId,
          total_amount: totalAmount,
          shipping_cost: shippingCost,
          shipping_method: effectiveShippingMethod,
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
      
      console.log("Order created with ID:", order.id);
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
        product_name: item.product.name,
        product_image_url: item.product.image_url || null
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
      
      console.log("Order items created successfully");
      
      // If using Stripe, create a checkout session
      if (paymentMethod === "stripe" && stripeConnectAccountId) {
        try {
          console.log("Creating Stripe checkout session for Connect account:", stripeConnectAccountId);
          
          const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
            apiVersion: "2023-10-16",
          });
          
          const lineItems = items.map(item => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.product.name,
                images: item.product.image_url ? [item.product.image_url] : []
              },
              unit_amount: Math.round(item.product.price * 100) // Convert to cents
            },
            quantity: item.quantity
          }));
          
          // Add shipping as a separate line item if applicable
          if (shippingCost > 0) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Shipping (${effectiveShippingMethod.replace('_', ' ')})`,
                },
                unit_amount: Math.round(shippingCost * 100) // Convert to cents
              },
              quantity: 1
            });
          }
          
          // Create the origin for return URLs
          const origin = req.headers.get("origin") || "http://localhost:3000";
          const returnUrl = `${origin}/site/${websiteId}/order-confirmation?order_id=${order.id}`;
          
          try {
            // Create Stripe checkout session using the Connected Account
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              line_items: lineItems,
              mode: "payment",
              success_url: returnUrl + "&status=success",
              cancel_url: returnUrl + "&status=cancelled",
              customer_email: customerInfo?.email,
              shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB"],
              },
              metadata: {
                order_id: order.id,
                website_id: websiteId
              },
              // Use the Stripe Connect account for the payment
              stripe_account: stripeConnectAccountId,
            });
            
            console.log("Stripe checkout session created:", session.id);
            
            // Update the order with the Stripe session ID
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
                order: {
                  id: order.id,
                  total: totalAmount,
                  shipping: shippingCost,
                  status: order.status
                },
                checkout_url: session.url
              }),
              {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          } catch (stripeError: any) {
            console.error("Stripe error:", stripeError);
            
            // Update the order to show the payment failed
            await supabaseAdmin
              .from("orders")
              .update({ status: "payment_failed" })
              .eq("id", order.id);
            
            return new Response(
              JSON.stringify({ 
                error: "Failed to create Stripe checkout session",
                details: stripeError.message
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
        } catch (error: any) {
          console.error("Error creating Stripe checkout:", error);
          return new Response(
            JSON.stringify({ 
              error: "Error processing payment",
              details: error.message 
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
      
      // For cash on delivery orders, just return success
      return new Response(
        JSON.stringify({
          success: true,
          order: {
            id: order.id,
            total: totalAmount,
            shipping: shippingCost,
            status: order.status
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Database error", details: dbError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in create-order:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
