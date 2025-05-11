
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import ContentPropertyEditor from "./ContentPropertyEditor";

const FeaturePropertyEditor: React.FC<PropertyEditorProps> = ({
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
        <Label htmlFor="featureDescription" className="text-sm text-gray-600 block mb-1">
          Description
        </Label>
        <TextArea
          id="featureDescription"
          value={properties.description || ""}
          onChange={(e) => onPropertyChange("description", e.target.value)}
          placeholder="Feature description"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="featureIcon" className="text-sm text-gray-600 block mb-1">
          Icon
        </Label>
        <Input
          id="featureIcon"
          value={properties.icon || ""}
          onChange={(e) => onPropertyChange("icon", e.target.value)}
          placeholder="★"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FeaturePropertyEditor;
