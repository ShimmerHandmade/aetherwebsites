
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

/**
 * Fetches all products for a specific website
 */
export const fetchProducts = async (websiteId: string): Promise<{
  products: Product[];
  categories: { name: string }[];
  error?: string;
}> => {
  try {
    // First check if we have an active session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log("No active session found when fetching products");
      return { 
        products: [], 
        categories: [],
        error: "Authentication required" 
      };
    }

    console.log(`Fetching products for website ID: ${websiteId}`);
    
    // Make the Supabase query with improved error handling
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("website_id", websiteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return { 
        products: [], 
        categories: [],
        error: error.message 
      };
    }

    console.log(`Fetched ${data?.length || 0} products successfully:`, data);
    
    // Extract unique categories from products - only include non-null categories
    const uniqueCategories = Array.from(
      new Set(
        data
          ?.filter(product => product.category)
          .map(product => product.category)
      )
    ).map(name => ({ name: name as string }));
    
    console.log(`Extracted ${uniqueCategories.length} unique categories:`, uniqueCategories);
    
    return { 
      products: data || [], 
      categories: uniqueCategories
    };
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return { 
      products: [], 
      categories: [],
      error: "An unexpected error occurred" 
    };
  }
};
