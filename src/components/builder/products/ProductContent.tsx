
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

interface ProductContentProps {
  isLoading: boolean;
  editingProduct: Product | null;
  filteredProducts: Product[];
  currentView: "grid" | "list";
  isAddingNew: boolean;
  isSaving: boolean;
  categories: { name: string }[];
  newCategory: string;
  imagePreview: string | null;
  onProductChange: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onNewCategoryChange: (category: string) => void;
  onAddCategory: () => void;
}

const ProductContent: React.FC<ProductContentProps> = ({
  isLoading,
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
  onAddCategory
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
        <p className="text-gray-500">Loading products...</p>
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

  return (
    <ScrollArea className="flex-1 h-[calc(100%-100px)]">
      {filteredProducts.length > 0 ? (
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
          {filteredProducts.length === 0 ? (
            <>No products found. Try a different search or add a new product.</>
          ) : (
            <>You haven't added any products yet. Click "Add Product" to create your first product.</>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

export default ProductContent;
