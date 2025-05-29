
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
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  // Determine if we're adding a new product based on the product ID
  const isAddingNew = !editingProduct?.id;

  // Filter products based on search term and active tab
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
    if (!editingProduct || !websiteId) return { success: false };
    
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
      // Use the ID to determine if this is a new product
      const isNewProduct = !editingProduct.id;
      
      const result = await saveProduct(
        editingProduct, 
        websiteId, 
        isNewProduct, 
        imageFile
      );

      if (result.success) {
        toast.success(isNewProduct ? "Product added successfully" : "Product updated successfully");
        setEditingProduct(null);
        setImagePreview(null);
        setImageFile(null);
        return { success: true, product: result.product };
      } else {
        toast.error(result.error || "Failed to save product");
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error("Failed to save product");
      return { success: false, error: String(error) };
    } finally {
      setIsSaving(false);
    }
  }, [editingProduct, websiteId, imageFile]);

  const handleCancel = useCallback(() => {
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!websiteId) return { success: false };
    
    if (!confirm("Are you sure you want to delete this product?")) {
      return { success: false };
    }
    
    try {
      const result = await deleteProduct(id, websiteId);
      
      if (result.success) {
        toast.success("Product deleted");
        return { success: true };
      } else {
        toast.error(result.error || "Failed to delete product");
        return { success: false, error: result.error };
      }
    } catch (error) {
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
    handleCancel,
    handleDelete,
    handleDeleteCategory,
    handleClearImage,
  };
}
