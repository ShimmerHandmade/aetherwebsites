
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { uploadProductImage } from "./uploadImage";

/**
 * Creates or updates a product
 */
export const saveProduct = async (
  product: Product,
  websiteId: string,
  isNew: boolean,
  imageFile: File | null
): Promise<{
  success: boolean;
  product?: Product;
  error?: string;
}> => {
  try {
    if (product.name.trim() === "") {
      return {
        success: false,
        error: "Product name is required"
      };
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return {
        success: false,
        error: "You need to be logged in to save products"
      };
    }

    const userId = session.session.user.id;
    
    // Handle new product
    if (isNew) {
      // Upload image first if provided
      let imageUrl: string | null = null;
      if (imageFile) {
        console.log("Uploading new product image...");
        imageUrl = await uploadProductImage(imageFile, websiteId, 'temp-' + Date.now());
        console.log("Image upload result:", imageUrl);
      }
      
      // Ensure we're passing all required product fields
      const newProductData = {
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
        category: product.category || null,
        is_featured: product.is_featured || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        image_url: imageUrl,
        user_id: userId,
        website_id: websiteId
      };
      
      console.log("Inserting new product with data:", newProductData);
      
      const { data, error } = await supabase
        .from("products")
        .insert(newProductData)
        .select();

      if (error) {
        console.error("Error adding product:", error);
        return {
          success: false,
          error: "Failed to add product: " + error.message
        };
      }

      if (data && data.length > 0) {
        let newProduct = data[0];
        
        // If we uploaded with a temporary ID, we need to move the image to the correct location
        if (imageUrl && imageFile) {
          const permanentImageUrl = await uploadProductImage(imageFile, websiteId, newProduct.id);
          
          if (permanentImageUrl) {
            // Update the product with the permanent image URL
            await supabase
              .from("products")
              .update({ image_url: permanentImageUrl })
              .eq("id", newProduct.id);
              
            newProduct.image_url = permanentImageUrl;
            
            // Try to delete the temporary image
            const tempFilePath = imageUrl.split('/').slice(-3).join('/');
            try {
              await supabase.storage
                .from('product-images')
                .remove([tempFilePath]);
            } catch (e) {
              console.log("Failed to clean up temporary image, but this is not critical");
            }
          }
        }
        
        return {
          success: true,
          product: newProduct
        };
      }
    } else {
      // Update existing product
      let imageUrl = product.image_url;
      
      // Upload new image if changed
      if (imageFile) {
        console.log("Uploading updated product image...");
        imageUrl = await uploadProductImage(imageFile, websiteId, product.id);
        console.log("Image upload result:", imageUrl);
      }
      
      // Create a complete update object with all product fields
      const updateData = {
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
        category: product.category || null,
        is_featured: product.is_featured || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        image_url: imageUrl
      };
      
      console.log("Updating product with data:", updateData);
      
      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", product.id)
        .eq("website_id", websiteId);

      if (error) {
        console.error("Error updating product:", error);
        return {
          success: false,
          error: "Failed to update product: " + error.message
        };
      }

      return {
        success: true,
        product: {...product, image_url: imageUrl}
      };
    }
    
    return {
      success: false,
      error: "Unknown error occurred"
    };
  } catch (error) {
    console.error("Error in saveProduct:", error);
    return {
      success: false,
      error: "An unexpected error occurred: " + (error as Error).message
    };
  }
};
