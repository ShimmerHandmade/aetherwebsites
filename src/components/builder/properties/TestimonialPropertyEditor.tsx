
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ContentPropertyEditor from "./ContentPropertyEditor";

const TestimonialPropertyEditor: React.FC<PropertyEditorProps> = ({
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
        <Label htmlFor="testimonialAuthor" className="text-sm text-gray-600 block mb-1">
          Author Name
        </Label>
        <Input
          id="testimonialAuthor"
          value={properties.author || ""}
          onChange={(e) => onPropertyChange("author", e.target.value)}
          placeholder="John Doe"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="testimonialRole" className="text-sm text-gray-600 block mb-1">
          Role/Position
        </Label>
        <Input
          id="testimonialRole"
          value={properties.role || ""}
          onChange={(e) => onPropertyChange("role", e.target.value)}
          placeholder="Customer"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TestimonialPropertyEditor;
