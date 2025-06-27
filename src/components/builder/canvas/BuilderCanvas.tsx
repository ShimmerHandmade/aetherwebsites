
import React, { useRef, memo } from "react";
import PageCanvas from "./PageCanvas";
import { useBuilder } from "@/contexts/builder/useBuilder";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import CanvasDragDropHandler from "./CanvasDragDropHandler";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  
  console.log("🎨 BuilderCanvas: Rendering with", elements?.length || 0, "elements");
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  return (
    <ErrorBoundary fallback={
      <div className="h-full flex items-center justify-center">
        <p className="text-red-600">Error loading canvas</p>
      </div>
    }>
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
    </ErrorBoundary>
  );
});

BuilderCanvas.displayName = 'BuilderCanvas';

export default BuilderCanvas;
