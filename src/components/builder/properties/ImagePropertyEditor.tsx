
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ContentPropertyEditor from "./ContentPropertyEditor";

const ImagePropertyEditor: React.FC<PropertyEditorProps> = ({
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
        <Label htmlFor="imageSrc" className="text-sm text-gray-600 block mb-1">
          Image URL
        </Label>
        <Input
          id="imageSrc"
          value={properties.src || ""}
          onChange={(e) => onPropertyChange("src", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="imageAlt" className="text-sm text-gray-600 block mb-1">
          Alt Text
        </Label>
        <Input
          id="imageAlt"
          value={properties.alt || ""}
          onChange={(e) => onPropertyChange("alt", e.target.value)}
          placeholder="Image description"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ImagePropertyEditor;
