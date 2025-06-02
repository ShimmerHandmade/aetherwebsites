
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import CanvasDragDropHandler from "../../canvas/CanvasDragDropHandler";
import { ElementWrapper } from "../ElementWrapper";
import { useBuilder } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const GridElement: React.FC<ElementProps> = ({ element }) => {
  const { selectedElementId, selectElement } = useBuilder();
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
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
  };
  
  // Dynamically select class based on columns property
  const columnClass = colClasses[columns as keyof typeof colClasses] || colClasses[2];
  
  // Handle click on the grid container
  const handleGridClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };
  
  return (
    <div 
      className={`${padding} border border-dashed border-gray-300 hover:border-blue-300 transition-colors rounded-md relative min-h-[100px]`}
      onClick={handleGridClick}
      data-element-id={element.id}
    >
      <CanvasDragDropHandler
        isPreviewMode={false}
        onCanvasClick={(e) => e.stopPropagation()}
        className="min-h-[80px] w-full"
      >
        {element.children && element.children.length > 0 ? (
          <div className={`grid ${columnClass} ${gap} w-full`}>
            {element.children.map((child, index) => (
              <div key={child.id} className="min-h-[80px] relative">
                <ElementWrapper 
                  element={child} 
                  index={index} 
                  selected={child.id === selectedElementId}
                  parentId={element.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid ${columnClass} ${gap} w-full`}>
            {Array(columns).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="border border-dashed border-gray-300 rounded-md bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="aspect-video flex items-center justify-center text-gray-400">
                  Drop elements here
                </div>
              </div>
            ))}
          </div>
        )}
      </CanvasDragDropHandler>
    </div>
  );
};

export default GridElement;
