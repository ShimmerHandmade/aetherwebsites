
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

export const fetchProducts = async (websiteId: string): Promise<{
  products: Product[];
  categories: { name: string }[];
  error?: string;
}> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { 
        products: [], 
        categories: [],
        error: "Authentication required" 
      };
    }

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

    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(
        data
          ?.filter(product => product.category)
          .map(product => product.category)
      )
    ).map(name => ({ name: name as string }));
    
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
      const newProductData = {
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
        category: product.category,
        is_featured: product.is_featured || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        user_id: userId,
        website_id: websiteId
      };
      
      const { data, error } = await supabase
        .from("products")
        .insert(newProductData)
        .select();

      if (error) {
        console.error("Error adding product:", error);
        return {
          success: false,
          error: "Failed to add product"
        };
      }

      if (data && data.length > 0) {
        let newProduct = data[0];
        
        // Upload image if provided
        if (imageFile) {
          const imageUrl = await uploadProductImage(imageFile, websiteId, newProduct.id);
          
          if (imageUrl) {
            // Update the product with the image URL
            await supabase
              .from("products")
              .update({ image_url: imageUrl })
              .eq("id", newProduct.id);
              
            newProduct.image_url = imageUrl;
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
        imageUrl = await uploadProductImage(imageFile, websiteId, product.id);
      }
      
      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          sku: product.sku,
          stock: product.stock,
          category: product.category,
          is_featured: product.is_featured || false,
          is_sale: product.is_sale || false,
          is_new: product.is_new || false,
          image_url: imageUrl
        })
        .eq("id", product.id)
        .eq("website_id", websiteId);

      if (error) {
        console.error("Error updating product:", error);
        return {
          success: false,
          error: "Failed to update product"
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
      error: "An unexpected error occurred"
    };
  }
};

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
      await supabase.storage
        .from('product-images')
        .remove([`${websiteId}/${productId}`]);
    } catch (imageError) {
      console.log("No images to delete or error removing images:", imageError);
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

export const uploadProductImage = async (
  imageFile: File, 
  websiteId: string, 
  productId: string
): Promise<string | null> => {
  if (!imageFile || !websiteId) return null;
  
  try {
    // Check if product-images bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketName = 'product-images';
    
    if (!buckets?.find(b => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }
    
    // Upload the file
    const filePath = `${websiteId}/${productId}/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageFile);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload product image");
    return null;
  }
};
