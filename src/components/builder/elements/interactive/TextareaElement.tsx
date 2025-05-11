
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const TextareaElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-4">
      <textarea 
        placeholder={element.props?.placeholder || "Enter text..."} 
        rows={element.props?.rows || 3}
        className="w-full px-3 py-2 border rounded"
        disabled={isPreviewMode}
      ></textarea>
    </div>
  );
};

export default TextareaElement;
