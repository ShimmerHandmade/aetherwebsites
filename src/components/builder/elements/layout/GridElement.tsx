
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const GridElement: React.FC<ElementProps> = ({ element }) => {
  // Use the props from the element, or provide defaults
  const columns = element.props?.columns || 2;
  const gap = element.props?.gap === 'large' ? '6' : element.props?.gap === 'small' ? '2' : '4';
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
  };
  
  // Dynamically select class based on columns property
  const columnClass = colClasses[columns as keyof typeof colClasses] || colClasses[2];
  
  return (
    <div className={`grid ${columnClass} gap-${gap} p-4 border border-dashed border-transparent hover:border-gray-300`}>
      {element.children && element.children.length > 0 ? (
        element.children.map((child, index) => (
          <div key={index} className="bg-white rounded-md">
            {/* Child elements would be rendered by parent component */}
            <div className="text-center text-gray-400 p-4">Child element placeholder</div>
          </div>
        ))
      ) : (
        Array(columns).fill(0).map((_, i) => (
          <div key={i} className="border border-dashed border-gray-300 p-4 text-center text-gray-400 rounded-md bg-gray-50">
            <div className="aspect-video flex items-center justify-center">
              Drop elements here
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GridElement;
