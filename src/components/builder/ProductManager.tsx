
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductManager } from "@/hooks/useProductManager";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import ProductContent from "./products/ProductContent";
import PlanLimitsInfo from "@/components/PlanLimitsInfo";
import { toast } from "sonner";
import { fetchProducts } from "@/api/products";
import { Product, UniqueCategory } from "@/types/product";

interface ProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId, onBackToBuilder }) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
  const effectiveWebsiteId = websiteId || websiteIdParam;
  
  // Add manual loading state for initial data fetch
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [rawCategories, setRawCategories] = useState<UniqueCategory[]>([]);
  
  // Fetch products directly when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      if (!effectiveWebsiteId) {
        setInitialLoading(false);
        setInitialLoadError("Website ID is missing");
        return;
      }
      
      try {
        setInitialLoading(true);
        const result = await fetchProducts(effectiveWebsiteId);
        
        if (result.error) {
          console.error("Error loading products:", result.error);
          setInitialLoadError(result.error);
          toast.error("Failed to load products", {
            description: result.error
          });
        } else {
          console.log(`Loaded ${result.products.length} products and ${result.categories.length} categories`);
          setRawProducts(result.products);
          setRawCategories(result.categories);
          setInitialLoadError(null);
        }
      } catch (error) {
        console.error("Exception loading products:", error);
        setInitialLoadError("An unexpected error occurred");
        toast.error("Failed to load products");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProducts();
  }, [effectiveWebsiteId]);
  
  const {
    products,
    editingProduct,
    setEditingProduct,
    isAddingNew,
    isLoading,
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
    categories,
    handleAddNew,
    handleEdit,
    handleImageChange,
    handleAddCategory,
    handleSave,
    handleCancel,
    handleDelete,
    handleDeleteCategory,
    handleClearImage,
    setProducts,
    setCategories
  } = useProductManager(effectiveWebsiteId, rawProducts, rawCategories);

  // Set the products and categories once they're loaded
  useEffect(() => {
    if (rawProducts.length > 0 || rawCategories.length > 0) {
      setProducts(rawProducts);
      setCategories(rawCategories);
    }
  }, [rawProducts, rawCategories, setProducts, setCategories]);
  
  const handleBackToBuilder = () => {
    if (editingProduct) {
      // If editing, ask for confirmation before navigating away
      if (confirm("You have unsaved product changes. Are you sure you want to go back without saving?")) {
        setEditingProduct(null);
        if (onBackToBuilder) onBackToBuilder();
      } 
      return;
    }
    
    // Navigate back to builder if not editing and callback exists
    if (onBackToBuilder) {
      onBackToBuilder();
    }
  };

  // Show loading state from either source
  const showLoading = initialLoading || isLoading;

  return (
    <div className="h-full flex flex-col">
      <ProductHeader
        title="Product Manager"
        isEditing={!!editingProduct}
        currentView={currentView}
        onAddNew={handleAddNew}
        onToggleView={() => setCurrentView(currentView === "grid" ? "list" : "grid")}
        onBack={handleBackToBuilder}
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
            <PlanLimitsInfo productCount={products.length} />
          </div>
        </div>
      )}

      <ProductContent
        isLoading={showLoading}
        loadingError={initialLoadError}
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
      />
    </div>
  );
};

export default ProductManager;
