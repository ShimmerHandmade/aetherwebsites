
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Deletes a website and all associated resources (products, images, etc.)
 */
export const deleteWebsite = async (websiteId: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log(`Starting deletion process for website: ${websiteId}`);
    
    // Step 1: Delete all products associated with this website
    // First get all product IDs to delete their images
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("website_id", websiteId);
    
    if (productsError) {
      console.error("Error fetching products for deletion:", productsError);
      // Continue with deletion even if we can't get products
    }
    
    // Step 2: Delete product images from storage
    if (products && products.length > 0) {
      try {
        console.log(`Found ${products.length} products to delete`);
        
        // For each product, delete its image directory
        for (const product of products) {
          // List all files in the product's directory
          const { data: files } = await supabase.storage
            .from('product-images')
            .list(`${websiteId}/${product.id}`);
            
          if (files && files.length > 0) {
            // Delete each file in the directory
            const filePaths = files.map(file => `${websiteId}/${product.id}/${file.name}`);
            await supabase.storage
              .from('product-images')
              .remove(filePaths);
            
            console.log(`Deleted ${filePaths.length} images for product ${product.id}`);
          }
        }
        
        // Try to delete the website directory too (may contain non-product images)
        try {
          const { data: websiteFiles } = await supabase.storage
            .from('product-images')
            .list(`${websiteId}`);
            
          if (websiteFiles && websiteFiles.length > 0) {
            const websiteFilePaths = websiteFiles
              .filter(file => !file.id.includes('/')) // Only direct files, not directories
              .map(file => `${websiteId}/${file.name}`);
              
            if (websiteFilePaths.length > 0) {
              await supabase.storage
                .from('product-images')
                .remove(websiteFilePaths);
            }
          }
        } catch (storageError) {
          console.log("Non-critical error cleaning up website files:", storageError);
        }
      } catch (imageError) {
        console.error("Error deleting product images:", imageError);
        // Continue with deletion even if image deletion fails
      }
      
      // Step 3: Delete all products
      const { error: deleteProductsError } = await supabase
        .from("products")
        .delete()
        .eq("website_id", websiteId);
      
      if (deleteProductsError) {
        console.error("Error deleting products:", deleteProductsError);
        return {
          success: false,
          error: "Failed to delete all products"
        };
      }
      
      console.log(`Successfully deleted all products for website ${websiteId}`);
    }

    // Step 4: Finally delete the website itself
    const { error: websiteError } = await supabase
      .from("websites")
      .delete()
      .eq("id", websiteId);
      
    if (websiteError) {
      console.error("Error deleting website:", websiteError);
      return {
        success: false,
        error: "Failed to delete website"
      };
    }
    
    console.log(`Website ${websiteId} successfully deleted`);
    return {
      success: true
    };
  } catch (error) {
    console.error("Error in deleteWebsite:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};
