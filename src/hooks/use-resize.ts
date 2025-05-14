
import { useState, useEffect, useRef } from 'react';
import { BuilderElement } from '@/contexts/builder/types';
import { useBuilder } from '@/contexts/builder/BuilderProvider';

type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

interface ResizeOptions {
  elementId: string;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: (newWidth: number, newHeight: number) => void;
}

export function useResize({
  elementId, 
  minWidth = 50, 
  minHeight = 50, 
  aspectRatio = false,
  onResizeStart,
  onResizeEnd
}: ResizeOptions) {
  const { findElementById, updateElement } = useBuilder();
  const [isResizing, setIsResizing] = useState(false);
  const [direction, setDirection] = useState<ResizeDirection | null>(null);
  const resizingRef = useRef<boolean>(false);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  
  // Start resize
  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, resizeDirection: ResizeDirection) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Get the element
    const element = findElementById(elementId);
    if (!element) return;
    
    // Get current size
    const width = element.props?.width || 100;
    const height = element.props?.height || 100;
    
    // Store initial values
    initialSizeRef.current = { width, height };
    
    // Get client position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startPositionRef.current = { x: clientX, y: clientY };
    setDirection(resizeDirection);
    setIsResizing(true);
    resizingRef.current = true;
    
    // Call onResizeStart callback if provided
    if (onResizeStart) onResizeStart();
    
    // Add document listeners
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleResize);
    document.addEventListener('touchend', handleResizeEnd);
  };
  
  // Handle resize movement
  const handleResize = (e: MouseEvent | TouchEvent) => {
    if (!resizingRef.current || !direction) return;
    
    // Get client position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate delta
    const deltaX = clientX - startPositionRef.current.x;
    const deltaY = clientY - startPositionRef.current.y;
    
    // Get initial size
    let { width, height } = initialSizeRef.current;
    
    // Calculate new dimensions based on resize direction
    let newWidth = width;
    let newHeight = height;
    
    if (['right', 'topRight', 'bottomRight'].includes(direction)) {
      newWidth = Math.max(width + deltaX, minWidth);
    }
    
    if (['left', 'topLeft', 'bottomLeft'].includes(direction)) {
      newWidth = Math.max(width - deltaX, minWidth);
    }
    
    if (['bottom', 'bottomLeft', 'bottomRight'].includes(direction)) {
      newHeight = Math.max(height + deltaY, minHeight);
    }
    
    if (['top', 'topLeft', 'topRight'].includes(direction)) {
      newHeight = Math.max(height - deltaY, minHeight);
    }
    
    // Maintain aspect ratio if needed
    if (aspectRatio) {
      const originalRatio = width / height;
      
      if (newWidth / newHeight > originalRatio) {
        newWidth = newHeight * originalRatio;
      } else {
        newHeight = newWidth / originalRatio;
      }
    }
    
    // Update element props
    updateElement(elementId, {
      props: {
        ...findElementById(elementId)?.props,
        width: Math.round(newWidth),
        height: Math.round(newHeight)
      }
    });
  };
  
  // End resize
  const handleResizeEnd = () => {
    if (!resizingRef.current) return;
    
    resizingRef.current = false;
    setIsResizing(false);
    setDirection(null);
    
    // Remove document listeners
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.removeEventListener('touchmove', handleResize);
    document.removeEventListener('touchend', handleResizeEnd);
    
    // Call onResizeEnd callback if provided
    if (onResizeEnd) {
      const element = findElementById(elementId);
      if (element) {
        onResizeEnd(
          element.props?.width || initialSizeRef.current.width,
          element.props?.height || initialSizeRef.current.height
        );
      }
    }
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResize);
      document.removeEventListener('touchend', handleResizeEnd);
    };
  }, []);
  
  return {
    isResizing,
    handleResizeStart,
    resizableProps: { isResizing, direction }
  };
}
