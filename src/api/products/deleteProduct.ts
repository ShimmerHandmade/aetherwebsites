
import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes a product and its associated images
 */
export const deleteProduct = async (productId: string, websiteId: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("website_id", websiteId);

    if (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        error: "Failed to delete product"
      };
    }

    // Try to delete the product images
    try {
      // List all files in the product's directory
      const { data: files } = await supabase.storage
        .from('product-images')
        .list(`${websiteId}/${productId}`);
        
      if (files && files.length > 0) {
        // Delete each file in the directory
        const filePaths = files.map(file => `${websiteId}/${productId}/${file.name}`);
        await supabase.storage
          .from('product-images')
          .remove(filePaths);
      }
    } catch (imageError) {
      console.log("Error removing images:", imageError);
      // Don't return error for image deletion issues
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return {
      success: false,
      error: "An unexpected error occurred"
    };
  }
};
