
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
import { cn } from "@/lib/utils";

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
  categories: { id: string; name: string }[];
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
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-6" />
        <h3 className="text-xl font-semibold mb-3">Error Loading Products</h3>
        <p className="text-gray-600 mb-8 max-w-md">{loadingError}</p>
        <div className="space-y-3">
          <Button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <div className="text-sm text-gray-500 mt-6">
            <p>Debugging information:</p>
            <pre className="bg-gray-100 p-3 mt-2 rounded text-xs text-left overflow-auto max-h-32 border">
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
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ProductForm
          product={editingProduct}
          onChange={onProductChange}
          categories={categories}
          newCategory={newCategory}
          onNewCategoryChange={onNewCategoryChange}
          onAddCategory={onAddCategory}
          imagePreview={imagePreview}
          onImageChange={onImageChange}
          onClearImage={onClearImage}
          planInfo={planInfo}
          isAddingNew={isAddingNew}
          isSaving={isSaving}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
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
    <div className="h-full flex flex-col space-y-6">
      {showPlanLimits && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Products: {planInfo.currentCount} / {planInfo.maxProducts}
            </span>
            <span className="text-xs font-medium">
              {Math.round(productUsagePercentage)}%
            </span>
          </div>
          <Progress 
            value={productUsagePercentage} 
            className={cn("h-2", isNearLimit ? "bg-amber-100" : "")}
          />
          
          {isAtLimit && (
            <Alert variant="destructive" className="mt-3 p-3">
              <AlertDescription className="text-sm">
                You've reached your product limit. Upgrade your plan to add more products.
              </AlertDescription>
            </Alert>
          )}
          
          {!isAtLimit && isNearLimit && (
            <Alert className="mt-3 p-3 bg-amber-50 border-amber-200 text-amber-800">
              <AlertDescription className="text-sm">
                You're approaching your product limit. Consider upgrading your plan soon.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      <div className="flex-1 bg-white rounded-lg border shadow-sm overflow-hidden">
        <ScrollArea className="h-full">
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="p-4">
              {currentView === "grid" ? (
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
              )}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <p className="text-xl font-medium text-gray-700 mb-2">No products found.</p>
                <p className="text-gray-500 mb-6">
                  {!filteredProducts || filteredProducts.length === 0 ? (
                    <>You haven't added any products yet. Click "Add Product" to create your first product.</>
                  ) : (
                    <>Try a different search or add a new product.</>
                  )}
                </p>
                <div className="border-t pt-6 mt-6">
                  <pre className="bg-gray-100 p-3 rounded text-xs text-left overflow-auto max-h-32 mx-auto">
                    Total products available: {filteredProducts ? filteredProducts.length : 0}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProductContent;
