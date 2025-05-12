
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

interface ProductHeaderProps {
  title: string;
  isEditing: boolean;
  currentView: "grid" | "list";
  onAddNew: () => void;
  onToggleView: () => void;
  onBack: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  isEditing,
  currentView,
  onAddNew,
  onToggleView,
  onBack
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="flex gap-2">
        {isEditing ? (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={onToggleView}
            >
              {currentView === "grid" ? "List View" : "Grid View"}
            </Button>
            <Button onClick={onAddNew} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;
