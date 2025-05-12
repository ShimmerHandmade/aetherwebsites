
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ProductsListPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const ProductsListPropertyEditor: React.FC<ProductsListPropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const columns = element.props?.columns || 4;
  const productsPerPage = element.props?.productsPerPage || 8;
  const showPagination = element.props?.showPagination !== false;
  const cardStyle = element.props?.cardStyle || "default";

  const handleColumnsChange = (value: number[]) => {
    onPropertyChange("columns", value[0]);
  };

  const handleProductsPerPageChange = (value: number[]) => {
    onPropertyChange("productsPerPage", value[0]);
  };

  const handleShowPaginationChange = (checked: boolean) => {
    onPropertyChange("showPagination", checked);
  };

  const handleCardStyleChange = (value: string) => {
    onPropertyChange("cardStyle", value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Products List Properties</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="columns">Columns: {columns}</Label>
            </div>
            <Slider
              id="columns"
              min={1}
              max={6}
              step={1}
              defaultValue={[columns]}
              onValueChange={handleColumnsChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="productsPerPage">Products per page: {productsPerPage}</Label>
            </div>
            <Slider
              id="productsPerPage"
              min={4}
              max={24}
              step={4}
              defaultValue={[productsPerPage]}
              onValueChange={handleProductsPerPageChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="showPagination" 
              checked={showPagination}
              onCheckedChange={handleShowPaginationChange}
            />
            <Label htmlFor="showPagination">Show pagination</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardStyle">Card Style</Label>
            <Select 
              value={cardStyle} 
              onValueChange={handleCardStyleChange}
            >
              <SelectTrigger id="cardStyle">
                <SelectValue placeholder="Select card style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="bordered">Bordered</SelectItem>
                <SelectItem value="shadow">Shadow</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsListPropertyEditor;
