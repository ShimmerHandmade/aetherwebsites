
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Uploads a product image to storage
 */
export const uploadProductImage = async (
  imageFile: File, 
  websiteId: string, 
  productId: string
): Promise<string | null> => {
  if (!imageFile || !websiteId) {
    console.warn("Missing image file or website ID for upload");
    toast.error("Missing required information for upload");
    return null;
  }
  
  try {
    console.log("Starting image upload process...");
    
    // Create a unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload the file
    const filePath = `${websiteId}/${productId}/${uniqueFileName}`;
    console.log(`Uploading to path: ${filePath}`);
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Error in uploadProductImage:", uploadError);
      toast.error("Upload failed", {
        description: uploadError.message || "Could not upload image to storage"
      });
      return null;
    }
    
    console.log("Upload successful, getting public URL");
    
    // Get the public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    console.log("Image uploaded successfully:", data.publicUrl);
    toast.success("Image uploaded successfully");
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload product image");
    return null;
  }
};
