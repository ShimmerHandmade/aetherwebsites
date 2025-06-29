
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
  const canvasRef = useRef<HTMLDivElement>(null);
  
  console.log("🎨 BuilderCanvas: Starting render", {
    isPreviewMode,
    isLiveSite,
    canvasRefCurrent: !!canvasRef.current
  });
  
  let builderContext;
  let elements;
  let selectElement;
  
  try {
    builderContext = useBuilder();
    elements = builderContext.elements;
    selectElement = builderContext.selectElement;
    
    console.log("🎨 BuilderCanvas: Got context", {
      hasContext: !!builderContext,
      elementsCount: elements?.length || 0,
      elementsType: Array.isArray(elements) ? "array" : typeof elements,
      hasSelectElement: typeof selectElement === 'function'
    });
  } catch (error) {
    console.error("❌ BuilderCanvas: Error getting builder context:", error);
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-600">Error: Unable to load builder context</p>
      </div>
    );
  }
  
  // Safety check for elements
  if (!Array.isArray(elements)) {
    console.error("❌ BuilderCanvas: Elements is not an array:", elements);
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-600">Error: Invalid elements data</p>
      </div>
    );
  }
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    console.log("🖱️ BuilderCanvas: Canvas clicked");
    try {
      if (e.target === e.currentTarget && selectElement) {
        selectElement(null);
      }
    } catch (error) {
      console.error("❌ BuilderCanvas: Error handling canvas click:", error);
    }
  };

  console.log("🎨 BuilderCanvas: About to render JSX");

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
