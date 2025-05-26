
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import ProductContent from "./products/ProductContent";
import PlanLimitsInfo from "@/components/PlanLimitsInfo";
import { toast } from "sonner";
import { fetchProducts } from "@/api/products";
import { Product, UniqueCategory } from "@/types/product";
import { usePlan } from "@/contexts/PlanContext";
import { checkProductLimit } from "@/utils/planRestrictions";
import { useProductManager } from "@/hooks/useProductManager";

interface ProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId, onBackToBuilder }) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
  const effectiveWebsiteId = websiteId || websiteIdParam;
  const { restrictions } = usePlan();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<UniqueCategory[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load products on mount
  useEffect(() => {
    const loadData = async () => {
      if (!effectiveWebsiteId) {
        setError("Website ID is missing");
        setInitialLoading(false);
        return;
      }
      
      try {
        console.log(`Loading products for website: ${effectiveWebsiteId}`);
        const result = await fetchProducts(effectiveWebsiteId);
        
        if (result.error) {
          setError(result.error);
          toast.error("Failed to load products");
        } else {
          console.log(`Loaded ${result.products.length} products`);
          setProducts(result.products);
          setCategories(result.categories);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
        toast.error("Failed to load products");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [effectiveWebsiteId]);
  
  // Product manager hook
  const {
    editingProduct,
    setEditingProduct,
    isAddingNew,
    isSaving,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    newCategory,
    setNewCategory,
    imagePreview,
    currentView,
    setCurrentView,
    filteredProducts,
    handleEdit,
    handleImageChange,
    handleAddCategory,
    handleSave: internalHandleSave,
    handleCancel,
    handleDelete: internalHandleDelete,
    handleDeleteCategory,
    handleClearImage,
  } = useProductManager(effectiveWebsiteId, products, categories);

  const handleAddNew = async () => {
    const canAddProduct = await checkProductLimit(products.length);
    
    if (!canAddProduct) {
      toast.error(`You've reached your plan's limit of ${restrictions?.maxProducts} products.`);
      return;
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
  };

  const refreshData = async () => {
    if (!effectiveWebsiteId) return;
    
    try {
      const result = await fetchProducts(effectiveWebsiteId);
      if (!result.error) {
        setProducts(result.products);
        setCategories(result.categories);
      }
    } catch (err) {
      console.error("Error refreshing:", err);
    }
  };

  const handleSave = async () => {
    const result = await internalHandleSave();
    if (result?.success) {
      await refreshData();
    }
    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await internalHandleDelete(id);
    if (result?.success) {
      await refreshData();
    }
    return result;
  };

  return (
    <div className="h-full flex flex-col">
      <ProductHeader
        title="Product Manager"
        isEditing={!!editingProduct}
        currentView={currentView}
        onAddNew={handleAddNew}
        onToggleView={() => setCurrentView(currentView === "grid" ? "list" : "grid")}
        onBack={onBackToBuilder}
      />

      {!editingProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 px-4">
          <div className="lg:col-span-3">
            <ProductSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={setNewCategory}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
          <div className="lg:col-span-1">
            <PlanLimitsInfo 
              productCount={products.length} 
              websiteCount={0}
            />
          </div>
        </div>
      )}

      <ProductContent
        isLoading={initialLoading}
        loadingError={error}
        editingProduct={editingProduct}
        filteredProducts={filteredProducts}
        currentView={currentView}
        isAddingNew={isAddingNew}
        isSaving={isSaving}
        categories={categories}
        newCategory={newCategory}
        imagePreview={imagePreview}
        onProductChange={setEditingProduct}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImageChange={handleImageChange}
        onClearImage={handleClearImage}
        onNewCategoryChange={setNewCategory}
        onAddCategory={handleAddCategory}
        planInfo={{
          maxProducts: restrictions?.maxProducts || 0,
          currentCount: products.length
        }}
      />
    </div>
  );
};

export default ProductManager;
