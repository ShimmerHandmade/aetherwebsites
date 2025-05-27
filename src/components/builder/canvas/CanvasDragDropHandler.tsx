
import React, { useState, useRef } from "react";
import { useBuilder } from "@/contexts/builder/BuilderProvider";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "@/components/ui/use-toast";
import { getContentInsertionIndex, ensureElementsOrder } from "@/contexts/builder/pageStructureUtils";

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
  const [dropTarget, setDropTarget] = useState<{top: boolean, element: string | null}>({top: true, element: null});
  const dragOverTimer = useRef<number | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }

    const targetElement = findDropTarget(e);
    if (targetElement) {
      setDropTarget(targetElement);
    }
  };

  const findDropTarget = (e: React.DragEvent): {top: boolean, element: string | null} => {
    const elementsFromPoint = document.elementsFromPoint(e.clientX, e.clientY);
    
    for (const el of elementsFromPoint) {
      const elementId = (el as HTMLElement).dataset?.elementId;
      if (elementId) {
        const rect = el.getBoundingClientRect();
        const isTopHalf = e.clientY < rect.top + rect.height / 2;
        return {
          top: isTopHalf,
          element: elementId
        };
      }
    }
    
    return {top: true, element: null};
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setDropTarget({top: true, element: null});
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setDropTarget({top: true, element: null});
    
    if (isPreviewMode) return;
    
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) {
        console.log("No data in drop event");
        return;
      }
      
      const elementData = JSON.parse(data);
      console.log("Dropped element data:", elementData);
      
      // Add new element from palette
      if (!elementData.id) {
        let newElement = {
          id: uuidv4(),
          type: elementData.type,
          content: elementData.content || "",
          props: elementData.props || {},
          children: elementData.children || []
        };
        
        // Special handling for container elements
        if (['flex', 'grid', 'container'].includes(elementData.type)) {
          newElement.children = [];
          console.log(`Creating container element: ${elementData.type}`);
        }
        
        // Special handling for certain element types
        if (elementData.type === 'productsList') {
          newElement.props = {
            columns: 3,
            productsPerPage: 6,
            showPagination: true,
            cardStyle: 'default',
            sortBy: 'created_at',
            sortOrder: 'desc',
            categoryFilter: 'all',
            ...newElement.props
          };
        }

        let insertIndex;
        
        // If we have a container, add to it
        if (containerId) {
          const container = findElementById(containerId);
          if (container) {
            if (dropTarget.element && dropTarget.element !== containerId) {
              const targetIndex = findElementIndex(dropTarget.element, containerId);
              if (targetIndex !== -1) {
                insertIndex = dropTarget.top ? targetIndex : targetIndex + 1;
              }
            }
            console.log(`Adding new element to container ${containerId} at position ${insertIndex || 'end'}`);
            addElement(newElement, insertIndex, containerId);
          }
        } else {
          // Adding to root - ensure proper ordering between header and footer
          if (dropTarget.element) {
            const targetIndex = findElementIndex(dropTarget.element);
            if (targetIndex !== -1) {
              insertIndex = dropTarget.top ? targetIndex : targetIndex + 1;
            }
          }
          
          // If no specific target, use content insertion logic
          if (insertIndex === undefined) {
            insertIndex = getContentInsertionIndex(elements);
          }
          
          console.log(`Adding new element to root at position ${insertIndex}`);
          addElement(newElement, insertIndex);
        }
        
        toast({
          title: "Element Added",
          description: `Added new ${elementData.type} element`
        });
        
        return;
      }
      
      // Handle moving existing elements
      if (elementData.id) {
        const sourceElement = findElementById(elementData.id);
        if (!sourceElement) {
          console.log("Source element not found:", elementData.id);
          return;
        }
        
        const sourceParentId = elementData.parentId;
        const sourceIndex = elementData.sourceIndex !== undefined ? Number(elementData.sourceIndex) : -1;
        
        // Moving within the same container
        if (sourceParentId === containerId) {
          if (dropTarget.element && dropTarget.element !== elementData.id) {
            const targetIndex = findElementIndex(dropTarget.element, containerId);
            if (targetIndex !== -1) {
              const adjustedTargetIndex = dropTarget.top ? targetIndex : targetIndex + 1;
              const destinationIndex = 
                sourceIndex !== -1 && sourceIndex < targetIndex ? 
                  adjustedTargetIndex - 1 : adjustedTargetIndex;
              
              console.log(`Moving element from ${sourceIndex} to ${destinationIndex} in same container`);
              moveElement(sourceIndex, destinationIndex, sourceParentId);
              return;
            }
          }
          
          if (!containerId && sourceIndex !== -1) {
            const dropIndex = elements.length - 1;
            moveElement(sourceIndex, dropIndex);
            console.log(`Moving element from ${sourceIndex} to ${dropIndex} at root level`);
            return;
          }
        }
        
        // Moving between different containers
        const elementCopy = { ...sourceElement };
        
        let insertIndex;
        if (dropTarget.element) {
          const targetIndex = findElementIndex(dropTarget.element, containerId);
          if (targetIndex !== -1) {
            insertIndex = dropTarget.top ? targetIndex : targetIndex + 1;
          }
        }
        
        // For root level drops, ensure proper ordering
        if (!containerId && insertIndex === undefined) {
          insertIndex = getContentInsertionIndex(elements);
        }
        
        addElement(elementCopy, insertIndex, containerId || null);
        console.log(`Added element to new container at position ${insertIndex || 'end'}`);
        
        // Remove from the original location
        if (sourceIndex !== -1) {
          setTimeout(() => {
            removeElement(elementData.id);
          }, 50);
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast({
        title: "Error",
        description: "Error adding element. Please try again."
      });
    }
  };

  const findElementIndex = (elementId: string, parentId?: string): number => {
    if (!parentId) {
      return elements.findIndex(el => el.id === elementId);
    }
    
    const parent = findElementById(parentId);
    if (parent && parent.children) {
      return parent.children.findIndex(el => el.id === elementId);
    }
    
    return -1;
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
