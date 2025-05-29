
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
    console.log("🔄 saveProduct called:", { product, websiteId, isNew });

    if (!product.name || product.name.trim() === "") {
      return {
        success: false,
        error: "Product name is required"
      };
    }

    if (!websiteId || websiteId.trim() === "") {
      return {
        success: false,
        error: "Website ID is required"
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
    console.log("👤 User ID:", userId);
    
    // Handle new product
    if (isNew) {
      // Upload image first if provided
      let imageUrl: string | null = null;
      if (imageFile) {
        console.log("📸 Uploading new product image...");
        const tempId = 'temp-' + Date.now();
        try {
          imageUrl = await uploadProductImage(imageFile, websiteId, tempId);
          console.log("✅ Image upload result:", imageUrl);
        } catch (error) {
          console.error("❌ Image upload failed:", error);
          // Continue without image rather than failing
        }
      }
      
      // Prepare product data for insertion
      const newProductData = {
        name: product.name.trim(),
        description: product.description?.trim() || null,
        price: Number(product.price) || 0,
        sku: product.sku?.trim() || null,
        stock: Number(product.stock) || 0,
        category: product.category?.trim() || null,
        is_featured: Boolean(product.is_featured),
        is_sale: Boolean(product.is_sale),
        is_new: Boolean(product.is_new),
        image_url: imageUrl,
        user_id: userId,
        website_id: websiteId
      };
      
      console.log("📝 Inserting new product:", newProductData);
      
      const { data, error } = await supabase
        .from("products")
        .insert(newProductData)
        .select()
        .single();

      if (error) {
        console.error("❌ Database error:", error);
        return {
          success: false,
          error: `Failed to add product: ${error.message}`
        };
      }

      if (data) {
        console.log("✅ Product created successfully:", data);
        return {
          success: true,
          product: data
        };
      }
    } else {
      // Update existing product
      if (!product.id || product.id.trim() === "") {
        return {
          success: false,
          error: "Product ID is required for updates"
        };
      }

      let imageUrl = product.image_url;
      
      // Upload new image if changed
      if (imageFile) {
        console.log("📸 Uploading updated product image...");
        try {
          imageUrl = await uploadProductImage(imageFile, websiteId, product.id);
          console.log("✅ Image upload result:", imageUrl);
        } catch (error) {
          console.error("❌ Image upload failed:", error);
          // Continue with existing image rather than failing
        }
      }
      
      const updateData = {
        name: product.name.trim(),
        description: product.description?.trim() || null,
        price: Number(product.price) || 0,
        sku: product.sku?.trim() || null,
        stock: Number(product.stock) || 0,
        category: product.category?.trim() || null,
        is_featured: Boolean(product.is_featured),
        is_sale: Boolean(product.is_sale),
        is_new: Boolean(product.is_new),
        image_url: imageUrl
      };
      
      console.log("📝 Updating product:", updateData);
      
      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", product.id)
        .eq("website_id", websiteId);

      if (error) {
        console.error("❌ Update error:", error);
        return {
          success: false,
          error: `Failed to update product: ${error.message}`
        };
      }

      console.log("✅ Product updated successfully");
      return {
        success: true,
        product: {...product, ...updateData}
      };
    }
    
    return {
      success: false,
      error: "Unknown error occurred"
    };
  } catch (error) {
    console.error("💥 Unexpected error in saveProduct:", error);
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
