
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const InputElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-4">
      <input 
        type={element.props?.type || "text"} 
        placeholder={element.props?.placeholder || "Enter text..."} 
        className="w-full px-3 py-2 border rounded"
        disabled={isPreviewMode}
      />
    </div>
  );
};

export default InputElement;
