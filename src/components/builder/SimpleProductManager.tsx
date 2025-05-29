
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductHeader from "./products/ProductHeader";
import ProductSearch from "./products/ProductSearch";
import ProductContent from "./products/ProductContent";
import { toast } from "sonner";
import { fetchProducts } from "@/api/products";
import { Product, UniqueCategory } from "@/types/product";
import { checkProductLimit } from "@/utils/planRestrictions";
import { useProductManager } from "@/hooks/useProductManager";
import { useSimplePlan } from "@/hooks/useSimplePlan";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

interface SimpleProductManagerProps {
  websiteId?: string;
  onBackToBuilder?: () => void;
}

const SimpleProductManager: React.FC<SimpleProductManagerProps> = ({ 
  websiteId, 
  onBackToBuilder 
}) => {
  const { id: websiteIdParam } = useParams<{ id: string }>();
  const effectiveWebsiteId = websiteId || websiteIdParam;
  const { restrictions, loading: planLoading, error: planError } = useSimplePlan();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<UniqueCategory[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products
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
    try {
      const canAddProduct = await checkProductLimit(products.length);
      
      if (!canAddProduct) {
        return;
      }
      
      // Create a completely new product with empty ID to ensure it's treated as new
      setEditingProduct({
        id: "", // Empty ID indicates new product
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
    } catch (error) {
      console.error("Error checking product limit:", error);
      toast.error("Unable to verify product limits. Please try again.");
    }
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

  // Show loading state
  if (planLoading || initialLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Product Manager</h3>
          <p className="text-gray-600">Setting up your product management tools...</p>
        </div>
      </div>
    );
  }

  // Show error if plan loading failed
  if (planError) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-white rounded-lg">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load plan information: {planError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg">
      <ProductHeader
        title="Product Manager"
        isEditing={!!editingProduct}
        currentView={currentView}
        onAddNew={handleAddNew}
        onToggleView={() => setCurrentView(currentView === "grid" ? "list" : "grid")}
        onBack={onBackToBuilder}
      />

      {!editingProduct && (
        <div className="px-6 mb-4">
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
      )}

      <div className="flex-1 px-6 pb-6">
        <ProductContent
          isLoading={false}
          loadingError={error}
          editingProduct={editingProduct}
          filteredProducts={filteredProducts}
          currentView={currentView}
          isAddingNew={!editingProduct?.id} // True when ID is empty or null
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
            maxProducts: restrictions.maxProducts,
            currentCount: products.length
          }}
        />
      </div>
    </div>
  );
};

export default SimpleProductManager;
