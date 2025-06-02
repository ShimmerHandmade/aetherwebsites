
import React, { useState, useRef, useCallback } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";

interface CanvasDragDropHandlerProps {
  children: React.ReactNode;
  isPreviewMode: boolean;
  onCanvasClick?: (e: React.MouseEvent) => void;
  className?: string;
  parentId?: string;
}

const CanvasDragDropHandler: React.FC<CanvasDragDropHandlerProps> = ({
  children,
  isPreviewMode,
  onCanvasClick,
  className = "",
  parentId
}) => {
  const { addElement, moveElement, elements, addElementToParent } = useBuilder();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    // Calculate drop position based on mouse position
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const elementHeight = 80;
      const targetElements = parentId ? elements.find(el => el.id === parentId)?.children || [] : elements;
      const index = Math.floor(y / elementHeight);
      setDragOverIndex(Math.min(index, targetElements.length));
    }
  }, [isPreviewMode, elements, parentId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    // Only hide drag indicator if we're leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  }, [isPreviewMode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragOverIndex(null);

    try {
      const dataString = e.dataTransfer.getData("application/json");
      if (!dataString) {
        console.warn("No drag data found");
        return;
      }

      const data = JSON.parse(dataString);
      console.log("Drop data:", data, "Parent ID:", parentId);

      if (data.isNewElement) {
        // Adding new element from palette
        const newElement = {
          id: uuidv4(),
          type: data.type,
          content: data.content || "",
          props: { ...data.props },
          children: data.children || undefined
        };

        const dropIndex = dragOverIndex !== null ? dragOverIndex : 0;
        
        if (parentId) {
          // Adding to a parent element (container, section, etc.)
          console.log(`Adding element to parent ${parentId} at index ${dropIndex}`);
          addElementToParent(parentId, newElement, dropIndex);
        } else {
          // Adding to root level
          console.log(`Adding element to root at index ${dropIndex}`);
          addElement(newElement, dropIndex);
        }
        
        toast.success(`${data.type} added to canvas`);
      } else if (data.id) {
        // Moving existing element
        if (parentId) {
          // Moving within a parent - this would require more complex logic
          console.log("Moving within parent not yet implemented");
        } else {
          const currentIndex = elements.findIndex(el => el.id === data.id);
          const newIndex = dragOverIndex !== null ? dragOverIndex : elements.length - 1;
          
          if (currentIndex !== -1 && currentIndex !== newIndex) {
            moveElement(currentIndex, newIndex);
            toast.success("Element moved");
          }
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error("Failed to drop element");
    }
  }, [isPreviewMode, dragOverIndex, elements, addElement, moveElement, addElementToParent, parentId]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (onCanvasClick) {
      onCanvasClick(e);
    }
  }, [onCanvasClick]);

  return (
    <div
      ref={dropZoneRef}
      className={`relative ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* Drop indicator */}
      {isDragOver && !isPreviewMode && (
        <div 
          className="absolute left-0 right-0 h-1 bg-blue-500 z-50 transition-all duration-150 rounded"
          style={{
            top: dragOverIndex !== null ? `${dragOverIndex * 80}px` : '0px'
          }}
        />
      )}
      
      {/* Content with proper drop zone styling */}
      <div className={`${isDragOver && !isPreviewMode ? 'bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-lg' : ''} transition-all duration-200`}>
        {children}
      </div>
    </div>
  );
};

export default CanvasDragDropHandler;
