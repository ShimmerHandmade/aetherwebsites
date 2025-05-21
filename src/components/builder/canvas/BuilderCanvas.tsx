
import React, { useState, useEffect, useRef, memo } from "react";
import PageCanvas from "./PageCanvas";
import { useBuilder } from "@/contexts/builder/useBuilder";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import CanvasDragDropHandler from "./CanvasDragDropHandler";

interface BuilderCanvasProps {
  isPreviewMode: boolean;
  isLiveSite?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = memo(({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { elements, selectElement } = useBuilder();
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Single initialization to prevent flickering
  useEffect(() => {
    if (!canvasReady) {
      // Set canvas ready once and don't change it
      setCanvasReady(true);
    }
  }, [canvasReady]);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle direct canvas clicks (not bubbled from elements)
    if (e.target === e.currentTarget) {
      // Deselect any element when clicking the canvas directly
      selectElement(null);
    }
  };

  return (
    <div 
      className={`w-full min-h-screen pb-20 relative ${canvasReady ? 'opacity-100' : 'opacity-0'}`}
      data-testid="builder-canvas"
      ref={canvasRef}
    >
      {!isPreviewMode && (
        <CanvasDragDropHandler 
          isPreviewMode={isPreviewMode}
          onCanvasClick={handleCanvasClick}
          className="w-full min-h-screen"
        >
          {elements.length === 0 ? (
            <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
          ) : (
            <PageCanvas 
              elements={elements} 
              isPreviewMode={isPreviewMode} 
              isLiveSite={isLiveSite}
            />
          )}
        </CanvasDragDropHandler>
      )}
      
      {/* When in preview mode, we directly render without the drag-drop handler */}
      {isPreviewMode && (
        elements.length === 0 ? (
          <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
        ) : (
          <PageCanvas 
            elements={elements} 
            isPreviewMode={isPreviewMode} 
            isLiveSite={isLiveSite}
          />
        )
      )}
    </div>
  );
});

// Add display name for React DevTools
BuilderCanvas.displayName = 'BuilderCanvas';

export default BuilderCanvas;
