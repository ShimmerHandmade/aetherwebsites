
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
    setIsDraggingOver(false);
    
    if (isPreviewMode) return;
    
    try {
      // Handle drops from the element palette
      const data = e.dataTransfer.getData("application/json");
      if (data) {
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
        
        // Handle element reordering or moving between containers
        if (elementData.id && elementData.sourceIndex !== undefined) {
          if (containerId) {
            // Move an element to this container
            const sourceElement = findElementById(elementData.id);
            if (sourceElement) {
              // Remove from original location and add to this container
              console.log("Moving element to container:", containerId, sourceElement);
              addElement({...sourceElement}, undefined, containerId);
              // We need to delay the removal slightly to avoid React rendering issues
              setTimeout(() => {
                // Remove from the original location
                console.log("Removing original element:", elementData.id);
                removeElement(elementData.id);
              }, 10);
            }
          } else {
            // Move at root level
            const dropIndex = elements.length;
            moveElement(elementData.sourceIndex, dropIndex);
          }
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
      data-container-id={containerId}
    >
      {children}
    </div>
  );
};

export default CanvasDragDropHandler;
