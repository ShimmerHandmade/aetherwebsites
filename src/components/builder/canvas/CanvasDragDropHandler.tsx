
import React, { useState, useRef, useCallback } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";

interface CanvasDragDropHandlerProps {
  children: React.ReactNode;
  isPreviewMode: boolean;
  onCanvasClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const CanvasDragDropHandler: React.FC<CanvasDragDropHandlerProps> = ({
  children,
  isPreviewMode,
  onCanvasClick,
  className = ""
}) => {
  const { addElement, moveElement, elements } = useBuilder();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    // Calculate drop position based on mouse position
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const elementHeight = 100; // Approximate element height
      const index = Math.floor(y / elementHeight);
      setDragOverIndex(Math.min(index, elements.length));
    }
  }, [isPreviewMode, elements.length]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    // Only hide drag indicator if we're leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  }, [isPreviewMode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);

    try {
      const dataString = e.dataTransfer.getData("application/json");
      if (!dataString) {
        console.warn("No drag data found");
        return;
      }

      const data = JSON.parse(dataString);
      console.log("Drop data:", data);

      if (data.isNewElement) {
        // Adding new element from palette
        const newElement = {
          id: uuidv4(),
          type: data.type,
          content: data.content || "",
          props: { ...data.props }
        };

        const dropIndex = dragOverIndex !== null ? dragOverIndex : elements.length;
        addElement(newElement, dropIndex);
        toast.success(`${data.type} added to canvas`);
      } else if (data.id) {
        // Moving existing element
        const currentIndex = elements.findIndex(el => el.id === data.id);
        const newIndex = dragOverIndex !== null ? dragOverIndex : elements.length - 1;
        
        if (currentIndex !== -1 && currentIndex !== newIndex) {
          moveElement(currentIndex, newIndex);
          toast.success("Element moved");
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error("Failed to drop element");
    }
  }, [isPreviewMode, dragOverIndex, elements, addElement, moveElement]);

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
          className="absolute left-0 right-0 h-1 bg-blue-500 z-50 transition-all duration-150"
          style={{
            top: dragOverIndex !== null ? `${dragOverIndex * 100}px` : '0px'
          }}
        />
      )}
      
      {/* Canvas background with drop zone styling */}
      <div className={`min-h-screen ${isDragOver && !isPreviewMode ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default CanvasDragDropHandler;
