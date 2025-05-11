
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentPropertyEditor from "./ContentPropertyEditor";

const ContainerPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <ContentPropertyEditor 
        content={element.content} 
        onContentChange={onContentChange} 
      />
      
      <div>
        <Label htmlFor="padding" className="text-sm text-gray-600 block mb-1">
          Padding
        </Label>
        <Select 
          value={properties.padding || "medium"}
          onValueChange={(value) => onPropertyChange("padding", value)}
        >
          <SelectTrigger id="padding">
            <SelectValue placeholder="Select padding" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="background" className="text-sm text-gray-600 block mb-1">
          Background
        </Label>
        <Select 
          value={properties.background || "white"}
          onValueChange={(value) => onPropertyChange("background", value)}
        >
          <SelectTrigger id="background">
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="gray">Gray</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContainerPropertyEditor;
