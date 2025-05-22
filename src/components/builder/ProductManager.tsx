
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProductManager } from "@/hooks/useProductManager";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import ProductContent from "./products/ProductContent";
import PlanLimitsInfo from "@/components/PlanLimitsInfo";
import { toast } from "sonner";
import { fetchProducts } from "@/api/products";
import { Product, UniqueCategory } from "@/types/product";
import { usePlanInfo } from "@/hooks/usePlanInfo";
import { getPlanLimits } from "@/utils/planRestrictions";
import { supabase } from "@/integrations/supabase/client";

interface ProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId, onBackToBuilder }) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
  const effectiveWebsiteId = websiteId || websiteIdParam;
  const planInfo = usePlanInfo();
  
  // States for data management
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [rawCategories, setRawCategories] = useState<UniqueCategory[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Improved logging
  console.log("ProductManager mounted/updated with:", {
    websiteId,
    websiteIdParam,
    effectiveWebsiteId,
    productsCount: rawProducts.length,
    planName: planInfo.planName,
    maxProducts: planInfo.restrictions?.maxProducts
  });
  
  // Enhanced data loading function
  const loadProducts = useCallback(async () => {
    if (!effectiveWebsiteId) {
      console.error("No website ID available");
      setInitialLoading(false);
      setInitialLoadError("Website ID is missing");
      return;
    }
    
    try {
      console.log(`Starting to load products for website: ${effectiveWebsiteId}`);
      setInitialLoading(true);
      
      const result = await fetchProducts(effectiveWebsiteId);
      
      if (result.error) {
        console.error("Error loading products:", result.error);
        setInitialLoadError(result.error);
        toast.error("Failed to load products", {
          description: result.error
        });
      } else {
        console.log(`Successfully loaded ${result.products.length} products and ${result.categories.length}`);
        // Important: Set state with the new data
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
  }, [effectiveWebsiteId]);

  // Load products on mount and when refreshTrigger changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts, refreshTrigger]);
  
  // Product manager hook with enhanced data passing
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
    handleAddNew: handleAddNewProduct,
    handleEdit,
    handleImageChange,
    handleAddCategory,
    handleSave: internalHandleSave,
    handleCancel,
    handleDelete: internalHandleDelete,
    handleDeleteCategory,
    handleClearImage,
    setProducts,
    setCategories,
  } = useProductManager(effectiveWebsiteId, rawProducts, rawCategories);

  // Set the products and categories once they're loaded
  useEffect(() => {
    if (rawProducts.length > 0 || rawCategories.length > 0) {
      console.log("Setting products and categories in useProductManager:", 
        rawProducts.length, "products,", rawCategories.length, "categories");
      setProducts(rawProducts);
      setCategories(rawCategories);
    }
  }, [rawProducts, rawCategories, setProducts, setCategories]);
  
  // Enhanced handlers with forced reload
  const handleSuccessfulOperation = async () => {
    console.log("Operation successful - triggering data refresh");
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleSave = async () => {
    const saveResult = await internalHandleSave();
    if (saveResult?.success) {
      await handleSuccessfulOperation();
    }
    return saveResult;
  };
  
  const handleDelete = async (id: string) => {
    const deleteResult = await internalHandleDelete(id);
    if (deleteResult?.success) {
      await handleSuccessfulOperation();
    }
    return deleteResult;
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
        toast.error(`You've reached your plan's limit of ${limits.maxProducts} products.`, {
          description: `Upgrade to ${planInfo.planName === 'Basic' ? 'Professional' : 'Enterprise'} plan for more products.`
        });
        return;
      }
    } catch (error) {
      console.error("Error checking product limits:", error);
    }
    
    // If within limits, proceed with adding new product
    handleAddNewProduct();
  };
  
  const handleBackToBuilder = () => {
    if (editingProduct) {
      if (confirm("You have unsaved product changes. Are you sure you want to go back without saving?")) {
        setEditingProduct(null);
        if (onBackToBuilder) onBackToBuilder();
      } 
      return;
    }
    
    if (onBackToBuilder) {
      onBackToBuilder();
    }
  };

  // Determine if we should show loading state
  const showLoading = initialLoading || isLoading || planInfo.loading;

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
            <PlanLimitsInfo 
              productCount={products.length} 
              websiteCount={0} // Changed from pageCount to websiteCount
            />
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
        planInfo={{
          maxProducts: planInfo.restrictions?.maxProducts || 0,
          currentCount: products.length
        }}
      />
    </div>
  );
};

export default ProductManager;
