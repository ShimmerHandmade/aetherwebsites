
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
      {element.children && element.children.length > 0 ? (
        element.children.map((child, index) => (
          <div key={index} className="flex justify-center items-center">
            {/* Child elements would be rendered by parent component */}
            <div className="text-center text-gray-400 p-4">Child element placeholder</div>
          </div>
        ))
      ) : (
        Array(columns).fill(0).map((_, i) => (
          <div key={i} className="border border-dashed border-gray-300 p-4 text-center text-gray-400">
            Drop elements here
          </div>
        ))
      )}
    </div>
  );
};

export default GridElement;
