
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const SelectElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-4">
      <select className="w-full px-3 py-2 border rounded" disabled={isPreviewMode}>
        <option value="">Select an option</option>
        {(element.props?.options || ["Option 1", "Option 2"]).map((option: string, i: number) => (
          <option key={i} value={option.toLowerCase().replace(/\s+/g, '-')}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectElement;
