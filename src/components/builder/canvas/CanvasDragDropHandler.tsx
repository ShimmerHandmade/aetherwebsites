
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid";

interface CanvasDragDropHandlerProps {
  children: React.ReactNode;
  isPreviewMode: boolean;
  onCanvasClick: (e: React.MouseEvent) => void;
  className: string;
}

const CanvasDragDropHandler: React.FC<CanvasDragDropHandlerProps> = ({ 
  children, 
  isPreviewMode, 
  onCanvasClick,
  className
}) => {
  const { addElement, moveElement, elements } = useBuilder();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    
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
    
    if (isPreviewMode) return;
    
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

  const canvasClassName = `${className} transition-colors duration-150 ${
    isDraggingOver && !isPreviewMode 
      ? 'bg-indigo-50 border-indigo-300 border-2 border-dashed shadow-inner' 
      : ''
  }`;

  return (
    <div 
      className={canvasClassName}
      onClick={onCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default CanvasDragDropHandler;
