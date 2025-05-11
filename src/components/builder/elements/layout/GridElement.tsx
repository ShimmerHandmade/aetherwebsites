
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const GridElement: React.FC<ElementProps> = ({ element }) => {
  const columns = element.props?.columns || 2;
  const gap = element.props?.gap === 'large' ? '4' : element.props?.gap === 'small' ? '2' : '3';
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap} p-4`}>
      {Array(columns).fill(0).map((_, i) => (
        <div key={i} className="border border-dashed border-gray-300 p-4 text-center">
          Grid item {i + 1}
        </div>
      ))}
    </div>
  );
};

export default GridElement;
