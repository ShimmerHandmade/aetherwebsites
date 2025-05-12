
import React, { useState, useRef } from "react";
import { useBuilder } from "@/contexts/builder";
import { renderElement } from "./renderElement";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Trash, GripVertical } from "lucide-react";

interface BuilderElementProps {
  element: any;
  index: number;
  selected: boolean;
  isPreviewMode?: boolean;
  parentId?: string;
}

export const ElementWrapper: React.FC<BuilderElementProps> = ({
  element,
  index,
  selected,
  isPreviewMode = false,
  parentId,
}) => {
  const { selectElement, removeElement, duplicateElement } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleElementClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation();
      selectElement(element.id);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    
    const data = {
      id: element.id,
      type: element.type,
      sourceIndex: index,
      parentId: parentId
    };
    
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    
    // Add a class to the element being dragged
    if (elementRef.current) {
      elementRef.current.classList.add("opacity-50");
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (elementRef.current) {
      elementRef.current.classList.remove("opacity-50");
    }
  };

  // Add different styling based on element type
  const getElementStyle = () => {
    // Basic style for all elements
    let style = "transition-all duration-150 relative";
    
    if (!isPreviewMode) {
      style += " hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2";
      
      if (selected) {
        style += " outline outline-2 outline-blue-500 outline-offset-2";
      }
      
      if (isDragging) {
        style += " opacity-50";
      }
    }
    
    // Add specific styling based on element type
    if (element.type === "section") {
      style += " min-h-[100px]";
    } else if (element.type === "container") {
      style += " min-h-[80px] p-4";
    }
    
    return style;
  };

  const renderedElement = renderElement(element);
  
  // Some elements can't or shouldn't be draggable/editable
  const isDraggable = !isPreviewMode && !["navbar", "footer"].includes(element.type);

  return (
    <div
      ref={elementRef}
      className={getElementStyle()}
      onClick={handleElementClick}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-element-id={element.id}
    >
      {renderedElement}
      
      {!isPreviewMode && selected && (
        <div className="absolute top-0 right-0 -mt-10 flex space-x-1 bg-white p-1 rounded shadow-sm z-10">
          {isDraggable && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-grab"
              title="Drag to reposition"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDuplicateClick}
            title="Duplicate element"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {!["navbar", "footer"].includes(element.type) && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDeleteClick}
              title="Remove element"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Also export as default for backward compatibility
export default ElementWrapper;
