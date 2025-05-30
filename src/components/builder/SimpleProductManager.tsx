
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

  console.log("SimpleProductManager mounted with websiteId:", effectiveWebsiteId);

  const refreshData = async () => {
    if (!effectiveWebsiteId) return;
    
    try {
      console.log("Refreshing product data...");
      const result = await fetchProducts(effectiveWebsiteId);
      if (!result.error) {
        setProducts(result.products);
        setCategories(result.categories);
        console.log("Product data refreshed successfully");
      } else {
        console.error("Error refreshing products:", result.error);
      }
    } catch (err) {
      console.error("Error refreshing:", err);
    }
  };

  // Product manager hook
  const productManager = useProductManager(
    effectiveWebsiteId, 
    products, 
    categories,
    refreshData
  );

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

  const handleAddNew = async () => {
    try {
      const canAddProduct = await checkProductLimit(products.length);
      
      if (!canAddProduct) {
        return;
      }
      
      productManager.setEditingProduct({
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
    } catch (error) {
      console.error("Error checking product limit:", error);
      toast.error("Unable to verify product limits. Please try again.");
    }
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
        isEditing={!!productManager.editingProduct}
        currentView={productManager.currentView}
        onAddNew={handleAddNew}
        onToggleView={() => productManager.setCurrentView(productManager.currentView === "grid" ? "list" : "grid")}
        onBack={onBackToBuilder}
        saveStatus={productManager.saveStatus}
        hasUnsavedChanges={productManager.hasUnsavedChanges}
        isSaving={productManager.isSaving}
        onSave={productManager.handleSave}
      />

      {!productManager.editingProduct && (
        <div className="px-4 mb-4">
          <ProductSearch
            searchTerm={productManager.searchTerm}
            onSearchChange={productManager.setSearchTerm}
            activeTab={productManager.activeTab}
            onTabChange={productManager.setActiveTab}
            categories={categories}
            newCategory={productManager.newCategory}
            onNewCategoryChange={productManager.setNewCategory}
            onAddCategory={productManager.handleAddCategory}
            onDeleteCategory={productManager.handleDeleteCategory}
          />
        </div>
      )}

      <ProductContent
        isLoading={false}
        loadingError={error}
        editingProduct={productManager.editingProduct}
        filteredProducts={productManager.filteredProducts}
        currentView={productManager.currentView}
        isAddingNew={productManager.isAddingNew}
        isSaving={productManager.isSaving}
        categories={categories}
        newCategory={productManager.newCategory}
        imagePreview={productManager.imagePreview}
        onProductChange={productManager.setEditingProduct}
        onSave={productManager.handleSave}
        onCancel={productManager.handleCancel}
        onEdit={productManager.handleEdit}
        onDelete={productManager.handleDelete}
        onImageChange={productManager.handleImageChange}
        onClearImage={productManager.handleClearImage}
        onNewCategoryChange={productManager.setNewCategory}
        onAddCategory={productManager.handleAddCategory}
        planInfo={{
          maxProducts: restrictions.maxProducts,
          currentCount: products.length
        }}
      />
    </div>
  );
};

export default SimpleProductManager;
