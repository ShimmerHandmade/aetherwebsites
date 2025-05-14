
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
        'relative',
        isResizing && 'select-none',
        className
      )}
      style={{ 
        width: width ? `${width}px` : 'auto', 
        height: height ? `${height}px` : 'auto',
        overflow: 'auto', // Allow scrolling if content is larger than container
      }}
    >
      {children}

      {/* Only show resize handles when selected */}
      {isSelected && showHandles && (
        <>
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
          
          {/* Bottom-right handle */}
          <div
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-50 opacity-70 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottomRight')}
            onTouchStart={(e) => handleResizeStart(e, 'bottomRight')}
          />
        </>
      )}
    </div>
  );
};

export default ResizableWrapper;
