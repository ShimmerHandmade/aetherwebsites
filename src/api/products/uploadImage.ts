
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
    return null;
  }
  
  try {
    // Check if product-images bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'product-images';
    
    if (!buckets?.find(b => b.name === bucketName)) {
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, { 
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        throw bucketError;
      }
    }
    
    // Create a unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload the file
    const filePath = `${websiteId}/${productId}/${uniqueFileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true // Updated from false to true to handle overwrites
      });
      
    if (uploadError) {
      console.error("Error in uploadProductImage:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log("Image uploaded successfully:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload product image");
    return null;
  }
};
