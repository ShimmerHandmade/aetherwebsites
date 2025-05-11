
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentPropertyEditor from "./ContentPropertyEditor";

const ButtonPropertyEditor: React.FC<PropertyEditorProps> = ({
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
        <Label htmlFor="buttonVariant" className="text-sm text-gray-600 block mb-1">
          Button Style
        </Label>
        <Select 
          value={properties.variant || "primary"}
          onValueChange={(value) => onPropertyChange("variant", value)}
        >
          <SelectTrigger id="buttonVariant">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ButtonPropertyEditor;
