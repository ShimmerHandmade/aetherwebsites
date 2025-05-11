
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import BuilderElement from "./BuilderElement";
import { v4 as uuidv4 } from "@/lib/uuid";

interface BuilderCanvasProps {
  isPreviewMode?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ isPreviewMode = false }) => {
  const { elements, selectElement, selectedElementId, addElement, moveElement } = useBuilder();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target && !isPreviewMode) {
      selectElement(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      // Handle drops from the element palette
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        const elementData = JSON.parse(data);
        
        // Add new element from palette
        if (!elementData.id) {
          addElement({
            id: uuidv4(),
            type: elementData.type,
            content: elementData.content,
            props: elementData.props || {},
          });
          return;
        }
        
        // Handle element reordering
        if (elementData.id && elementData.sourceIndex !== undefined) {
          const dropIndex = elements.length;
          moveElement(elementData.sourceIndex, dropIndex);
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  return (
    <div 
      className={`${isPreviewMode ? '' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'} relative ${
        isPreviewMode ? 'min-h-screen' : 'min-h-[800px]'
      } ${isDraggingOver && !isPreviewMode ? 'bg-blue-50 border-blue-200 border-2' : ''}`}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {elements.length > 0 ? (
        elements.map((element, index) => (
          <BuilderElement
            key={element.id}
            element={element}
            index={index}
            selected={!isPreviewMode && selectedElementId === element.id}
            isPreviewMode={isPreviewMode}
          />
        ))
      ) : (
        !isPreviewMode && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">Drop Elements Here</h3>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              Drag elements from the sidebar into this area to start building your website.
            </p>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              Your canvas is empty. Drag elements here to build your page.
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default BuilderCanvas;
