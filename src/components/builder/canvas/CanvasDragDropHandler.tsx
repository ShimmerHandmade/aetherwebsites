
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid";

interface CanvasDragDropHandlerProps {
  children: React.ReactNode;
  isPreviewMode: boolean;
  onCanvasClick: (e: React.MouseEvent) => void;
  className: string;
  containerId?: string; 
}

const CanvasDragDropHandler: React.FC<CanvasDragDropHandlerProps> = ({ 
  children, 
  isPreviewMode, 
  onCanvasClick,
  className,
  containerId
}) => {
  const { addElement, moveElement, elements, findElementById, removeElement } = useBuilder();
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
    e.stopPropagation();
    setIsDraggingOver(false);
    
    if (isPreviewMode) return;
    
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      
      const elementData = JSON.parse(data);
      
      // Add new element from palette
      if (!elementData.id) {
        const newElement = {
          id: uuidv4(),
          type: elementData.type,
          content: elementData.content || "",
          props: elementData.props || {},
        };
        
        // Add to container or root
        addElement(newElement, undefined, containerId);
        console.log("Added new element to container:", containerId, newElement);
        return;
      }
      
      // Element already exists, handle moving
      if (elementData.id) {
        const sourceElement = findElementById(elementData.id);
        if (!sourceElement) return;
        
        const sourceParentId = elementData.parentId;
        
        // If moving within same container or both at root level
        if (sourceParentId === containerId) {
          // Let the existing moveElement handle this case if it's at root level
          if (!containerId && elementData.sourceIndex !== undefined) {
            const dropIndex = elements.length;
            moveElement(elementData.sourceIndex, dropIndex);
            return;
          }
        }
        
        // Add a cloned copy to the new location
        const elementCopy = {
          ...sourceElement
        };
        
        // Add element to the new container first before removing
        addElement(elementCopy, undefined, containerId);
        
        // We need to delay the removal slightly to avoid React rendering issues
        setTimeout(() => {
          // Remove from the original location  
          removeElement(elementData.id);
        }, 50);
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
      data-container-id={containerId}
    >
      {children}
    </div>
  );
};

export default CanvasDragDropHandler;
