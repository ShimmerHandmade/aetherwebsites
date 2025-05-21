
import React, { useState, useEffect } from "react";
import PageCanvas from "./PageCanvas";
import { useBuilder } from "@/contexts/builder/useBuilder";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import CanvasDragDropHandler from "./CanvasDragDropHandler";

interface BuilderCanvasProps {
  isPreviewMode: boolean;
  isLiveSite?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { elements, selectElement } = useBuilder();
  const [isLoaded, setIsLoaded] = useState(false);
  const [renderAttempt, setRenderAttempt] = useState(0);
  
  // Add stabilization effect to prevent blanking
  useEffect(() => {
    // Use a short delay to allow the DOM to settle
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Add retry mechanism if elements are taking too long
  useEffect(() => {
    if (elements.length === 0 && renderAttempt < 3) {
      const retryTimer = setTimeout(() => {
        setRenderAttempt(prev => prev + 1);
      }, 500 * (renderAttempt + 1)); // Increasing backoff
      
      return () => clearTimeout(retryTimer);
    }
  }, [elements, renderAttempt]);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle direct canvas clicks (not bubbled from elements)
    if (e.target === e.currentTarget) {
      // Deselect any element when clicking the canvas directly
      selectElement(null);
    }
  };

  return (
    <div className={`w-full min-h-screen pb-20 relative transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {!isPreviewMode && (
        <CanvasDragDropHandler 
          isPreviewMode={isPreviewMode}
          onCanvasClick={handleCanvasClick}
          className="w-full min-h-screen"
        >
          {/* Content to be wrapped by the drag-drop handler */}
          {elements.length === 0 ? (
            <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
          ) : (
            <PageCanvas 
              elements={elements} 
              isPreviewMode={isPreviewMode} 
              isLiveSite={isLiveSite}
              key={`page-canvas-${renderAttempt}`} // Force re-render on retry
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
            key={`preview-canvas-${renderAttempt}`} // Force re-render on retry
          />
        )
      )}
    </div>
  );
};

export default BuilderCanvas;
