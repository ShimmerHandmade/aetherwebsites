
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const FlexPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="direction" className="text-sm text-gray-600 block mb-1">
          Direction
        </Label>
        <Select 
          value={properties.direction || "row"}
          onValueChange={(value) => onPropertyChange("direction", value)}
        >
          <SelectTrigger id="direction">
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="row">Row</SelectItem>
            <SelectItem value="column">Column</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="justify" className="text-sm text-gray-600 block mb-1">
          Justify Content
        </Label>
        <Select 
          value={properties.justify || "center"}
          onValueChange={(value) => onPropertyChange("justify", value)}
        >
          <SelectTrigger id="justify">
            <SelectValue placeholder="Select justification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="end">End</SelectItem>
            <SelectItem value="between">Space Between</SelectItem>
            <SelectItem value="around">Space Around</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="align" className="text-sm text-gray-600 block mb-1">
          Align Items
        </Label>
        <Select 
          value={properties.align || "center"}
          onValueChange={(value) => onPropertyChange("align", value)}
        >
          <SelectTrigger id="align">
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="end">End</SelectItem>
            <SelectItem value="stretch">Stretch</SelectItem>
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
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="wrap" 
          checked={properties.wrap || false}
          onCheckedChange={(checked) => onPropertyChange("wrap", checked)}
        />
        <Label htmlFor="wrap" className="text-sm text-gray-600">
          Wrap items
        </Label>
      </div>
    </div>
  );
};

export default FlexPropertyEditor;
