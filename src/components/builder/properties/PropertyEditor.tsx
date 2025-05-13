
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Card } from "@/components/ui/card";

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
    <Card className="rounded-md border border-gray-200 overflow-hidden">
      <div className="space-y-4 p-4">
        {/* This is a base component that will be extended by specific property editors */}
      </div>
    </Card>
  );
};

export default PropertyEditor;
