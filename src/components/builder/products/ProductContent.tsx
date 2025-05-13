
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, RefreshCcw } from "lucide-react";
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanLimitInfo {
  maxProducts: number;
  currentCount: number;
}

interface ProductContentProps {
  isLoading: boolean;
  loadingError?: string | null;
  editingProduct: Product | null;
  filteredProducts: Product[];
  currentView: "grid" | "list";
  isAddingNew: boolean;
  isSaving: boolean;
  categories: { name: string }[];
  newCategory: string;
  imagePreview: string | null;
  onProductChange: (product: Product) => void;
  onSave: () => Promise<any> | void;
  onCancel: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<any> | void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onNewCategoryChange: (category: string) => void;
  onAddCategory: () => void;
  planInfo?: PlanLimitInfo;
}

const ProductContent: React.FC<ProductContentProps> = ({
  isLoading,
  loadingError,
  editingProduct,
  filteredProducts,
  currentView,
  isAddingNew,
  isSaving,
  categories,
  newCategory,
  imagePreview,
  onProductChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onImageChange,
  onClearImage,
  onNewCategoryChange,
  onAddCategory,
  planInfo
}) => {
  // Debug logs to track component rendering and props
  useEffect(() => {
    console.log("ProductContent rendering with products:", filteredProducts);
    console.log("Current loading state:", isLoading);
    console.log("Error state:", loadingError);
    console.log("Plan info:", planInfo);
  }, [filteredProducts, isLoading, loadingError, planInfo]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
        <p className="text-gray-600 mb-6">{loadingError}</p>
        <div className="space-y-2">
          <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <div className="text-sm text-gray-500 mt-4">
            <p>Debugging information:</p>
            <pre className="bg-gray-100 p-2 mt-2 rounded text-xs text-left overflow-auto max-h-32">
              Error: {loadingError}<br />
              Current timestamp: {new Date().toISOString()}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        isAddingNew={isAddingNew}
        isSaving={isSaving}
        onSave={onSave}
        onCancel={onCancel}
        onProductChange={onProductChange}
        onImageChange={onImageChange}
        imagePreview={imagePreview}
        onClearImage={onClearImage}
        newCategory={newCategory}
        onNewCategoryChange={onNewCategoryChange}
        onAddCategory={onAddCategory}
      />
    );
  }

  // Display plan limits if we have that information
  const showPlanLimits = planInfo && planInfo.maxProducts > 0;
  const productUsagePercentage = showPlanLimits 
    ? (planInfo.currentCount / planInfo.maxProducts) * 100
    : 0;
  const isNearLimit = productUsagePercentage >= 80;
  const isAtLimit = planInfo?.currentCount >= planInfo?.maxProducts;

  return (
    <>
      {showPlanLimits && (
        <div className="px-4 mb-4">
          <div className="bg-white p-3 rounded-md border shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                Products: {planInfo.currentCount} / {planInfo.maxProducts}
              </span>
              <span className="text-xs font-medium">
                {Math.round(productUsagePercentage)}%
              </span>
            </div>
            <Progress 
              value={productUsagePercentage} 
              className={`h-2 ${isNearLimit ? 'bg-amber-100' : ''}`}
              indicatorClassName={isNearLimit ? 'bg-amber-500' : undefined}
            />
            
            {isAtLimit && (
              <Alert variant="destructive" className="mt-2 p-2">
                <AlertDescription className="text-xs">
                  You've reached your product limit. Upgrade your plan to add more products.
                </AlertDescription>
              </Alert>
            )}
            
            {!isAtLimit && isNearLimit && (
              <Alert variant="warning" className="mt-2 p-2 bg-amber-50 border-amber-200 text-amber-800">
                <AlertDescription className="text-xs">
                  You're approaching your product limit. Consider upgrading your plan soon.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1 h-[calc(100%-100px)]">
        {filteredProducts && filteredProducts.length > 0 ? (
          currentView === "grid" ? (
            <ProductGrid 
              products={filteredProducts}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <ProductList
              products={filteredProducts}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No products found.</p>
            <p className="text-sm mb-4">
              {!filteredProducts || filteredProducts.length === 0 ? (
                <>You haven't added any products yet. Click "Add Product" to create your first product.</>
              ) : (
                <>Try a different search or add a new product.</>
              )}
            </p>
            <pre className="bg-gray-100 p-2 mt-4 rounded text-xs text-left overflow-auto max-h-32 mx-auto max-w-md">
              Total products available: {filteredProducts ? filteredProducts.length : 0}
            </pre>
          </div>
        )}
      </ScrollArea>
    </>
  );
};

export default ProductContent;
