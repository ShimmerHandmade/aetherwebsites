
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Grid, List, Save } from "lucide-react";

interface ProductHeaderProps {
  title: string;
  isEditing: boolean;
  currentView: "grid" | "list";
  onAddNew: () => void;
  onToggleView: () => void;
  onBack?: () => void;
  saveStatus?: string;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  title,
  isEditing,
  currentView,
  onAddNew,
  onToggleView,
  onBack,
  saveStatus,
  hasUnsavedChanges,
  isSaving,
  onSave
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          
          {saveStatus && (
            <span className={`text-sm ${
              hasUnsavedChanges ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {saveStatus}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isEditing && onSave && (
            <Button 
              size="sm" 
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
          
          {!isEditing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleView}
              >
                {currentView === "grid" ? (
                  <>
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4 mr-2" />
                    Grid View
                  </>
                )}
              </Button>
              <Button onClick={onAddNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
