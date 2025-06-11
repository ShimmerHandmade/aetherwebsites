
import React, { useRef, memo } from "react";
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
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  return (
    <div 
      className="w-full h-full overflow-auto"
      data-testid="builder-canvas"
      ref={canvasRef}
    >
      <div className="min-h-full pb-20 relative">
        {!isPreviewMode && (
          <CanvasDragDropHandler 
            isPreviewMode={isPreviewMode}
            onCanvasClick={handleCanvasClick}
            className="w-full min-h-full"
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
    </div>
  );
});

BuilderCanvas.displayName = 'BuilderCanvas';

export default BuilderCanvas;
