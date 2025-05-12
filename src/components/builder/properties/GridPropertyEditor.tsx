
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GridPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="columns" className="text-sm text-gray-600 block mb-1">
          Columns
        </Label>
        <Select 
          value={String(properties.columns || "2")}
          onValueChange={(value) => onPropertyChange("columns", parseInt(value))}
        >
          <SelectTrigger id="columns">
            <SelectValue placeholder="Select columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Column</SelectItem>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="6">6 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="gap" className="text-sm text-gray-600 block mb-1">
          Gap
        </Label>
        <Select 
          value={properties.gap || "medium"}
          onValueChange={(value) => onPropertyChange("gap", value)}
        >
          <SelectTrigger id="gap">
            <SelectValue placeholder="Select gap size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="padding" className="text-sm text-gray-600 block mb-1">
          Padding
        </Label>
        <Select 
          value={properties.padding || "medium"}
          onValueChange={(value) => onPropertyChange("padding", value)}
        >
          <SelectTrigger id="padding">
            <SelectValue placeholder="Select padding size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GridPropertyEditor;
