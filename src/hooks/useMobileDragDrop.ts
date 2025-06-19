
import { useState, useCallback, useRef } from "react";
import { useIsMobile } from "./use-mobile";

interface DragData {
  id: string;
  type: string;
  sourceIndex: number;
  parentId?: string;
}

export const useMobileDragDrop = () => {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [dragData, setDragData] = useState<DragData | null>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 15; // Minimum distance to start dragging

  const handleDragStart = useCallback((
    e: React.TouchEvent | React.DragEvent,
    data: DragData
  ) => {
    if (!isMobile && 'dataTransfer' in e) {
      // Desktop drag
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify(data));
      setIsDragging(true);
      setDragData(data);
      return;
    }

    if (isMobile && 'touches' in e) {
      // Mobile touch drag
      const touch = e.touches[0];
      dragStartPosition.current = { x: touch.clientX, y: touch.clientY };
      setDragData(data);
    }
  }, [isMobile]);

  const handleDragMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !dragData || !dragStartPosition.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragStartPosition.current.x);
    const deltaY = Math.abs(touch.clientY - dragStartPosition.current.y);
    const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (totalMovement > dragThreshold && !isDragging) {
      setIsDragging(true);
      // Provide haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [isMobile, dragData, isDragging, dragThreshold]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragData(null);
    dragStartPosition.current = null;
  }, []);

  const handleDrop = useCallback((
    e: React.TouchEvent | React.DragEvent,
    onDrop: (data: DragData) => void
  ) => {
    e.preventDefault();
    
    let dropData: DragData | null = null;

    if (!isMobile && 'dataTransfer' in e) {
      // Desktop drop
      try {
        dropData = JSON.parse(e.dataTransfer.getData("application/json"));
      } catch (error) {
        console.error("Failed to parse drag data:", error);
        return;
      }
    } else if (isMobile && dragData) {
      // Mobile drop
      dropData = dragData;
    }

    if (dropData) {
      onDrop(dropData);
    }

    handleDragEnd();
  }, [isMobile, dragData, handleDragEnd]);

  const getDragProps = useCallback((data: DragData) => {
    const baseProps = {
      draggable: !isMobile,
      onDragStart: !isMobile ? (e: React.DragEvent) => handleDragStart(e, data) : undefined,
      onDragEnd: !isMobile ? handleDragEnd : undefined,
    };

    const mobileProps = isMobile ? {
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e, data),
      onTouchMove: handleDragMove,
      onTouchEnd: handleDragEnd,
    } : {};

    return { ...baseProps, ...mobileProps };
  }, [isMobile, handleDragStart, handleDragMove, handleDragEnd]);

  const getDropProps = useCallback((onDrop: (data: DragData) => void) => {
    const baseProps = {
      onDragOver: !isMobile ? (e: React.DragEvent) => e.preventDefault() : undefined,
      onDrop: !isMobile ? (e: React.DragEvent) => handleDrop(e, onDrop) : undefined,
    };

    const mobileProps = isMobile ? {
      onTouchEnd: (e: React.TouchEvent) => {
        if (isDragging) {
          handleDrop(e, onDrop);
        }
      },
    } : {};

    return { ...baseProps, ...mobileProps };
  }, [isMobile, isDragging, handleDrop]);

  return {
    isDragging,
    dragData,
    getDragProps,
    getDropProps,
    handleDragStart,
    handleDragEnd,
  };
};
