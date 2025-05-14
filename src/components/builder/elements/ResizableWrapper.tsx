
import React from 'react';
import { useResize } from '@/hooks/use-resize';
import { cn } from '@/lib/utils';
import { useBuilder } from '@/contexts/builder/useBuilder';

interface ResizableWrapperProps {
  elementId: string;
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  maintainAspectRatio?: boolean;
  showHandles?: boolean;
  isSelected?: boolean;
  isPreviewMode?: boolean;
}

const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  elementId,
  children,
  className,
  minWidth = 50,
  minHeight = 50,
  maintainAspectRatio = false,
  showHandles = true,
  isSelected = false,
  isPreviewMode = false,
}) => {
  const { findElementById } = useBuilder();
  const element = findElementById(elementId);
  
  const { isResizing, handleResizeStart, resizableProps } = useResize({
    elementId,
    minWidth,
    minHeight,
    aspectRatio: maintainAspectRatio,
  });

  // Get element dimensions from props
  const width = element?.props?.width;
  const height = element?.props?.height;
  
  // Don't show resize handles in preview mode
  if (isPreviewMode) {
    return (
      <div 
        className={cn(className, "overflow-hidden")} 
        style={{ 
          width: width ? `${width}px` : 'auto', 
          height: height ? `${height}px` : 'auto' 
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative group overflow-hidden',
        isResizing && 'select-none',
        className
      )}
      style={{ 
        width: width ? `${width}px` : 'auto', 
        height: height ? `${height}px` : 'auto' 
      }}
    >
      {children}

      {/* Only show resize handles when selected */}
      {isSelected && showHandles && (
        <>
          {/* Top handle */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            onTouchStart={(e) => handleResizeStart(e, 'top')}
          />
          
          {/* Right handle */}
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            onTouchStart={(e) => handleResizeStart(e, 'right')}
          />
          
          {/* Bottom handle */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            onTouchStart={(e) => handleResizeStart(e, 'bottom')}
          />
          
          {/* Left handle */}
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            onTouchStart={(e) => handleResizeStart(e, 'left')}
          />
          
          {/* Top-left handle */}
          <div
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'topLeft')}
            onTouchStart={(e) => handleResizeStart(e, 'topLeft')}
          />
          
          {/* Top-right handle */}
          <div
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'topRight')}
            onTouchStart={(e) => handleResizeStart(e, 'topRight')}
          />
          
          {/* Bottom-right handle */}
          <div
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottomRight')}
            onTouchStart={(e) => handleResizeStart(e, 'bottomRight')}
          />
          
          {/* Bottom-left handle */}
          <div
            className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottomLeft')}
            onTouchStart={(e) => handleResizeStart(e, 'bottomLeft')}
          />
        </>
      )}
    </div>
  );
};

export default ResizableWrapper;
