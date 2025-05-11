
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

export interface PropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  return (
    <div className="space-y-4">
      {/* This is a base component that will be extended by specific property editors */}
    </div>
  );
};

export default PropertyEditor;
