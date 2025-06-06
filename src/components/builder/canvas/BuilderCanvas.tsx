
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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanvasReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  if (!canvasReady) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Initializing canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full min-h-screen pb-20 relative"
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

BuilderCanvas.displayName = 'BuilderCanvas';

export default BuilderCanvas;
