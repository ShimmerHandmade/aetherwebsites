
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
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.log("No active session found when fetching products");
      return { 
        products: [], 
        categories: [],
        error: "Authentication required" 
      };
    }

    console.log(`Fetching products for website ID: ${websiteId}`);
    
    // Improve logging to help debug the query
    console.log("Making Supabase query with website_id:", websiteId);
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("website_id", websiteId);

    if (error) {
      console.error("Error fetching products:", error);
      return { 
        products: [], 
        categories: [],
        error: error.message 
      };
    }

    console.log(`Fetched ${data?.length || 0} products:`, data);
    
    // Extract unique categories - only include non-null categories
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
