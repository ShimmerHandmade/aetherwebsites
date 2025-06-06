
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
import { useSaveManager } from "@/hooks/useSaveManager";
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
    handleAddNew: productManagerHandleAddNew,
  } = useProductManager(effectiveWebsiteId, products, categories);

  // Save manager for handling save operations
  const saveManager = useSaveManager({
    onSave: async () => {
      if (editingProduct) {
        const result = await internalHandleSave();
        if (result?.success) {
          await refreshData();
          return true;
        }
      }
      return false;
    }
  });

  const handleAddNew = async () => {
    try {
      const canAddProduct = await checkProductLimit(products.length);
      
      if (!canAddProduct) {
        return;
      }
      
      // Use the product manager's handleAddNew function to ensure proper state management
      productManagerHandleAddNew();
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
    return await saveManager.save();
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
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
      <div className="h-full flex items-center justify-center p-6">
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
        <div className="px-4 mb-4">
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

      <ProductContent
        isLoading={false}
        loadingError={error}
        editingProduct={editingProduct}
        filteredProducts={filteredProducts}
        currentView={currentView}
        isAddingNew={isAddingNew}
        isSaving={saveManager.isSaving}
        categories={categories}
        newCategory={newCategory}
        imagePreview={imagePreview}
        onProductChange={(product) => {
          setEditingProduct(product);
          saveManager.markAsChanged();
        }}
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
  );
};

export default SimpleProductManager;
