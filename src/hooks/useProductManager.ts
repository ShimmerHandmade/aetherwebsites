import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Product, UniqueCategory } from "@/types/product";
import { saveProduct, deleteProduct } from "@/api/products";
import { getPlanLimits } from "@/utils/planRestrictions";
import { fetchProducts } from "@/api/products";
import { supabase } from "@/integrations/supabase/client";

export function useProductManager(
  websiteId: string | undefined,
  initialProducts: Product[] = [],
  initialCategories: UniqueCategory[] = []
) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<UniqueCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  // Debug products state changes
  useEffect(() => {
    console.log("Products state updated in useProductManager:", products.length, "products");
  }, [products]);

  // Filter products based on search term and active tab
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "featured") return matchesSearch && product.is_featured;
    if (activeTab === "sale") return matchesSearch && product.is_sale;
    if (activeTab === "new") return matchesSearch && product.is_new;
    if (activeTab === "out-of-stock") return matchesSearch && product.stock === 0;
    
    return matchesSearch;
  });

  // Function to refresh data from the server
  const refreshData = async () => {
    if (!websiteId) return;
    
    setIsLoading(true);
    try {
      console.log(`Manually refreshing products for website: ${websiteId}`);
      const result = await fetchProducts(websiteId);
      if (!result.error) {
        console.log(`Refresh successful: ${result.products.length} products loaded`);
        setProducts(result.products);
        setCategories(result.categories);
      } else {
        console.error("Error refreshing products:", result.error);
        toast.error("Failed to refresh products");
      }
    } catch (error) {
      console.error("Exception refreshing products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = async () => {
    // Check if adding a new product would exceed the plan limit
    try {
      // Get the current user
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        toast.error("You must be logged in to add products");
        return;
      }
      
      // Get the profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      const limits = getPlanLimits(profile);
      
      if (products.length >= limits.maxProducts) {
        toast.error(`You've reached your plan's limit of ${limits.maxProducts} products`);
        return;
      }
    } catch (error) {
      console.error("Error checking product limits:", error);
    }
    
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      sku: "",
      stock: 0,
      category: "",
      is_featured: false,
      is_sale: false,
      is_new: true,
      image_url: null
    });
    setImagePreview(null);
    setImageFile(null);
    setIsAddingNew(true);
  };

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
    setEditingProduct({...product});
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setIsAddingNew(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Maximum file size is 5MB"
      });
      return;
    }
    
    // Image type validation
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPG, GIF, etc.)"
      });
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !websiteId) return;
    
    // Add the new category to our local state if it doesn't exist already
    if (!categories.some(c => c.name === newCategory)) {
      setCategories([...categories, { name: newCategory }]);
      toast.success("Category added");
    } else {
      toast.info("Category already exists");
    }
    setNewCategory("");
  };

  const handleSave = async () => {
    if (!editingProduct || !websiteId) return { success: false };
    
    // If this is a new product, check if it would exceed the plan limit
    if (isAddingNew) {
      try {
        // Get the current user
        const { data } = await supabase.auth.getUser();
        
        if (!data.user) {
          toast.error("You must be logged in to add products");
          return { success: false };
        }
        
        // Get the profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        const limits = getPlanLimits(profile);
        
        if (products.length >= limits.maxProducts) {
          toast.error(`You've reached your plan's limit of ${limits.maxProducts} products`);
          return { success: false };
        }
      } catch (error) {
        console.error("Error checking product limits:", error);
      }
    }
    
    // Validate required fields
    if (!editingProduct.name.trim()) {
      toast.error("Product name is required");
      return { success: false };
    }
    
    if (editingProduct.price <= 0) {
      toast.error("Price must be greater than zero");
      return { success: false };
    }
    
    setIsSaving(true);

    try {
      console.log(`Saving product: ${editingProduct.name} (isNew: ${isAddingNew})`);
      const result = await saveProduct(
        editingProduct, 
        websiteId, 
        isAddingNew, 
        imageFile
      );

      if (result.success && result.product) {
        console.log(`Product saved successfully: ${result.product.id}`);
        
        if (isAddingNew) {
          // Add new product to local state (at the beginning for newest first)
          console.log("Adding new product to local state");
          setProducts(prevProducts => {
            const updatedProducts = [result.product!, ...prevProducts];
            console.log(`Updated products count: ${updatedProducts.length}`);
            return updatedProducts;
          });
        } else {
          // Update existing product in local state
          console.log("Updating existing product in local state");
          setProducts(prevProducts => {
            const updatedProducts = prevProducts.map(p => 
              p.id === result.product!.id ? result.product! : p
            );
            console.log(`Updated products count: ${updatedProducts.length}`);
            return updatedProducts;
          });
        }
        
        // If this product has a new category, add it to our categories list
        if (result.product.category && !categories.some(c => c.name === result.product!.category)) {
          setCategories([...categories, { name: result.product.category }]);
        }
        
        toast.success(isAddingNew ? "Product added successfully" : "Product updated successfully");
        setEditingProduct(null);
        
        return { success: true, product: result.product };
      } else {
        console.error("Error saving product:", result.error);
        toast.error(result.error || "An error occurred");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Exception saving product:", error);
      toast.error("Failed to save product");
      return { success: false, error: String(error) };
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!websiteId) return { success: false };
    
    if (!confirm("Are you sure you want to delete this product?")) {
      return { success: false };
    }
    
    try {
      console.log(`Deleting product: ${id}`);
      const result = await deleteProduct(id, websiteId);
      
      if (result.success) {
        console.log("Product deleted successfully");
        // Remove the deleted product from local state
        setProducts(prevProducts => {
          const updatedProducts = prevProducts.filter(p => p.id !== id);
          console.log(`Updated products count after deletion: ${updatedProducts.length}`);
          return updatedProducts;
        });
        
        toast.success("Product deleted");
        
        // Update categories list if needed
        refreshCategoriesList();
        
        return { success: true };
      } else {
        console.error("Error deleting product:", result.error);
        toast.error(result.error || "Failed to delete product");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Exception deleting product:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error: String(error) };
    }
  };
  
  // Function to refresh categories list based on current products
  const refreshCategoriesList = () => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .filter(product => product.category)
          .map(product => product.category)
      )
    ).map(name => ({ name: name as string }));
        
    setCategories(uniqueCategories);
  };
  
  const handleDeleteCategory = (categoryName: string) => {
    setCategories(categories.filter(c => c.name !== categoryName));
    toast.success("Category removed from list");
  };
  
  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (editingProduct) {
      setEditingProduct({...editingProduct, image_url: null});
    }
  };

  return {
    products,
    categories,
    searchTerm,
    setSearchTerm,
    editingProduct,
    setEditingProduct,
    isAddingNew,
    isLoading,
    isSaving,
    activeTab,
    setActiveTab,
    newCategory,
    setNewCategory,
    imageFile,
    imagePreview,
    currentView,
    setCurrentView,
    filteredProducts,
    handleAddNew,
    handleEdit,
    handleImageChange,
    handleAddCategory,
    handleSave,
    handleCancel,
    handleDelete,
    handleDeleteCategory,
    handleClearImage,
    refreshCategoriesList,
    setProducts,
    setCategories,
    refreshData
  };
}
