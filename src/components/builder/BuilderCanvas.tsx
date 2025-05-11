
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import BuilderElement from "./BuilderElement";

const BuilderCanvas = () => {
  const { elements, selectElement, selectedElementId } = useBuilder();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      selectElement(null);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm min-h-[800px] border border-gray-200 p-4 relative"
      onClick={handleCanvasClick}
    >
      {elements.length > 0 ? (
        elements.map((element, index) => (
          <BuilderElement
            key={element.id}
            element={element}
            index={index}
            selected={selectedElementId === element.id}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium text-gray-700 mb-4">Drop Elements Here</h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Drag elements from the sidebar into this area to start building your website.
          </p>
          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
            Your canvas is empty. Drag elements here to build your page.
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderCanvas;
