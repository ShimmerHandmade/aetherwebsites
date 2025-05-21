
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

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
          notes: notes || null
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
    
    // For simplicity, we'll just return the order details directly
    // In a real app, this might trigger payment processing or other workflows
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
