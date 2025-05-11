
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const CheckboxElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-4 flex items-center">
      <input type="checkbox" className="mr-2" disabled={isPreviewMode} />
      <span>{element.content || "Checkbox label"}</span>
    </div>
  );
};

export default CheckboxElement;
