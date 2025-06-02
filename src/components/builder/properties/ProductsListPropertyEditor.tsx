
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const ProductsListPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Columns</Label>
        <Select 
          value={String(properties.columns || 3)}
          onValueChange={(value) => onPropertyChange("columns", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Column</SelectItem>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="5">5 Columns</SelectItem>
            <SelectItem value="6">6 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Products Per Page</Label>
        <Input
          type="number"
          value={properties.productsPerPage || 12}
          onChange={(e) => onPropertyChange("productsPerPage", parseInt(e.target.value) || 12)}
          min={1}
          max={100}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Card Style</Label>
        <Select 
          value={properties.cardStyle || "default"}
          onValueChange={(value) => onPropertyChange("cardStyle", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showPagination" 
          checked={properties.showPagination !== false} 
          onCheckedChange={(checked) => onPropertyChange("showPagination", checked)}
        />
        <Label htmlFor="showPagination">Show Pagination</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showFilters" 
          checked={properties.showFilters || false} 
          onCheckedChange={(checked) => onPropertyChange("showFilters", checked)}
        />
        <Label htmlFor="showFilters">Show Filters</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showSearch" 
          checked={properties.showSearch || false} 
          onCheckedChange={(checked) => onPropertyChange("showSearch", checked)}
        />
        <Label htmlFor="showSearch">Show Search</Label>
      </div>
    </div>
  );
};

export default ProductsListPropertyEditor;
