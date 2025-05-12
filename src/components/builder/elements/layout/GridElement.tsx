
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const GridElement: React.FC<ElementProps> = ({ element }) => {
  // Use the props from the element, or provide defaults
  const columns = element.props?.columns || 2;
  const gap = element.props?.gap === 'large' ? 'gap-6' : 
              element.props?.gap === 'small' ? 'gap-2' : 'gap-4';
  const padding = element.props?.padding === 'large' ? 'p-8' : 
                 element.props?.padding === 'small' ? 'p-2' : 'p-4';
  
  // Improved column classes with better responsive behavior
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
  };
  
  // Dynamically select class based on columns property
  const columnClass = colClasses[columns as keyof typeof colClasses] || colClasses[2];
  
  return (
    <div className={`grid ${columnClass} ${gap} ${padding} border border-dashed border-transparent hover:border-gray-300 transition-colors duration-200`}>
      {element.children && element.children.length > 0 ? (
        element.children.map((child, index) => (
          <div key={index} className="min-h-[100px] bg-white rounded-md">
            {/* Child elements would be rendered by parent component */}
            <div className="text-center text-gray-400 p-4">Child element placeholder</div>
          </div>
        ))
      ) : (
        Array(columns).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="border border-dashed border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-video flex items-center justify-center text-gray-400">
              Drop elements here
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GridElement;
