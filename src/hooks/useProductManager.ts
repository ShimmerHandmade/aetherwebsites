
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Product, UniqueCategory } from "@/types/product";
import { saveProduct, deleteProduct } from "@/api/products";

export function useProductManager(
  websiteId: string | undefined,
  products: Product[],
  categories: UniqueCategory[]
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "featured") return matchesSearch && product.is_featured;
    if (activeTab === "sale") return matchesSearch && product.is_sale;
    if (activeTab === "new") return matchesSearch && product.is_new;
    if (activeTab === "out-of-stock") return matchesSearch && product.stock === 0;
    
    return matchesSearch;
  });

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct({...product});
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setIsAddingNew(false);
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Maximum file size is 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
  }, []);

  const handleAddCategory = useCallback(() => {
    if (!newCategory.trim()) return;
    
    if (!categories.some(c => c.name === newCategory)) {
      toast.success("Category will be available after saving a product with this category");
    } else {
      toast.info("Category already exists");
    }
    setNewCategory("");
  }, [newCategory, categories]);

  const handleSave = useCallback(async () => {
    if (!editingProduct || !websiteId) {
      toast.error("Missing product or website information");
      return { success: false };
    }
    
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
      console.log("Saving product:", editingProduct);
      console.log("Is adding new:", isAddingNew);
      console.log("Website ID:", websiteId);
      
      // For new products, ensure we don't pass an invalid ID
      const productToSave = isAddingNew ? 
        { ...editingProduct, id: "" } : // Clear ID for new products
        editingProduct;
      
      const result = await saveProduct(
        productToSave, 
        websiteId, 
        isAddingNew, 
        imageFile
      );

      if (result.success) {
        toast.success(isAddingNew ? "Product added successfully" : "Product updated successfully");
        setEditingProduct(null);
        setImagePreview(null);
        setImageFile(null);
        setIsAddingNew(false);
        return { success: true, product: result.product };
      } else {
        console.error("Save product failed:", result.error);
        toast.error(result.error || "Failed to save product");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
      return { success: false, error: String(error) };
    } finally {
      setIsSaving(false);
    }
  }, [editingProduct, websiteId, isAddingNew, imageFile]);

  const handleCancel = useCallback(() => {
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
    setIsAddingNew(false);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!websiteId) {
      toast.error("Website ID is missing");
      return { success: false };
    }
    
    if (!confirm("Are you sure you want to delete this product?")) {
      return { success: false };
    }
    
    try {
      console.log("Deleting product:", id);
      const result = await deleteProduct(id, websiteId);
      
      if (result.success) {
        toast.success("Product deleted");
        return { success: true };
      } else {
        console.error("Delete product failed:", result.error);
        toast.error(result.error || "Failed to delete product");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error: String(error) };
    }
  }, [websiteId]);
  
  const handleDeleteCategory = useCallback((categoryName: string) => {
    toast.success("Category removed from list");
  }, []);
  
  const handleClearImage = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    if (editingProduct) {
      setEditingProduct({...editingProduct, image_url: null});
    }
  }, [editingProduct]);

  const handleAddNew = useCallback(() => {
    const newProduct = {
      id: "", // Empty ID for new products
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
    };
    
    console.log("Creating new product:", newProduct);
    setEditingProduct(newProduct);
    setImagePreview(null);
    setImageFile(null);
    setIsAddingNew(true);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    editingProduct,
    setEditingProduct,
    isAddingNew,
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
    handleEdit,
    handleImageChange,
    handleAddCategory,
    handleSave,
    handleCancel: useCallback(() => {
      setEditingProduct(null);
      setImagePreview(null);
      setImageFile(null);
      setIsAddingNew(false);
    }, []),
    handleDelete: useCallback(async (id: string) => {
      if (!websiteId) {
        toast.error("Website ID is missing");
        return { success: false };
      }
      
      if (!confirm("Are you sure you want to delete this product?")) {
        return { success: false };
      }
      
      try {
        console.log("Deleting product:", id);
        const result = await deleteProduct(id, websiteId);
        
        if (result.success) {
          toast.success("Product deleted");
          return { success: true };
        } else {
          console.error("Delete product failed:", result.error);
          toast.error(result.error || "Failed to delete product");
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An unexpected error occurred");
        return { success: false, error: String(error) };
      }
    }, [websiteId]),
    handleDeleteCategory: useCallback((categoryName: string) => {
      toast.success("Category removed from list");
    }, []),
    handleClearImage: useCallback(() => {
      setImagePreview(null);
      setImageFile(null);
      if (editingProduct) {
        setEditingProduct({...editingProduct, image_url: null});
      }
    }, [editingProduct]),
    handleAddNew,
  };
}
