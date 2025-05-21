
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
  
  // Simplified loading logic - single stable transition
  useEffect(() => {
    // Use a short delay to allow component mounting
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle direct canvas clicks (not bubbled from elements)
    if (e.target === e.currentTarget) {
      // Deselect any element when clicking the canvas directly
      selectElement(null);
    }
  };

  return (
    <div 
      className={`w-full min-h-screen pb-20 relative transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      data-testid="builder-canvas"
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
};

export default BuilderCanvas;
