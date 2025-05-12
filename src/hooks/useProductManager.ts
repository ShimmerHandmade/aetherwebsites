import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Product, UniqueCategory } from "@/types/product";
import { fetchProducts, saveProduct, deleteProduct } from "@/api/products";
import { checkProductLimit } from "@/utils/planRestrictions";

export function useProductManager(websiteId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<UniqueCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

  // Fetch products
  useEffect(() => {
    if (!websiteId) return;
    
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await fetchProducts(websiteId);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        setProducts(result.products);
        setCategories(result.categories);
      }
      
      setIsLoading(false);
    };

    loadProducts();
  }, [websiteId]);

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

  const handleAddNew = async () => {
    // Check if adding a new product would exceed the plan limit
    const canAddProduct = await checkProductLimit(products.length);
    
    if (!canAddProduct) {
      return; // Don't allow adding new product if limit is reached
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
    if (!editingProduct || !websiteId) return;
    
    // If this is a new product, check if it would exceed the plan limit
    if (isAddingNew) {
      const canAddProduct = await checkProductLimit(products.length);
      if (!canAddProduct) {
        return; // Don't allow saving if limit is reached
      }
    }
    
    // Validate required fields
    if (!editingProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (editingProduct.price <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }
    
    setIsSaving(true);

    try {
      const result = await saveProduct(
        editingProduct, 
        websiteId, 
        isAddingNew, 
        imageFile
      );

      if (result.success && result.product) {
        if (isAddingNew) {
          setProducts([...products, result.product]);
        } else {
          setProducts(products.map(p => p.id === result.product!.id ? result.product! : p));
        }
        
        // If this product has a new category, add it to our categories list
        if (result.product.category && !categories.some(c => c.name === result.product!.category)) {
          setCategories([...categories, { name: result.product.category }]);
        }
        
        toast.success(isAddingNew ? "Product added successfully" : "Product updated successfully");
        setEditingProduct(null);
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
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
    if (!websiteId) return;
    
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const result = await deleteProduct(id, websiteId);
      
      if (result.success) {
        setProducts(products.filter(p => p.id !== id));
        toast.success("Product deleted");
        
        // Update categories list if needed
        refreshCategoriesList();
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred");
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
    refreshCategoriesList
  };
}
