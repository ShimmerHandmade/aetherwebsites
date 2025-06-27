
import React, { useState, useEffect, useRef, memo } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement } from "@/contexts/builder/types";
import { ElementWrapper } from "../elements";
import { usePlan } from "@/contexts/PlanContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import ErrorBoundary from "@/components/ErrorBoundary";

interface PageCanvasProps {
  elements: BuilderElement[];
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
  onError?: () => void;
}

const PageCanvas: React.FC<PageCanvasProps> = memo(({ 
  elements, 
  isPreviewMode = false,
  isLiveSite = false,
  onError
}) => {
  const { selectedElementId } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();
  const [canvasVisible, setCanvasVisible] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  console.log("📄 PageCanvas: Rendering", elements?.length || 0, "elements");
  
  useEffect(() => {
    setCanvasVisible(true);
  }, []);

  // Safe element rendering with error boundary
  const renderElementSafely = (element: BuilderElement, index: number) => {
    if (!element || !element.id) {
      console.warn("⚠️ PageCanvas: Invalid element at index", index);
      return null;
    }

    try {
      return (
        <ErrorBoundary 
          key={element.id}
          fallback={
            <div className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
              <p className="font-medium">Error rendering {element.type} element</p>
              <p className="text-sm mt-1">Element ID: {element.id}</p>
            </div>
          }
        >
          <ElementWrapper 
            element={element}
            index={index}
            selected={selectedElementId === element.id}
            isPreviewMode={isPreviewMode}
            canUseAnimations={isPremium || isEnterprise}
            canUseEnterpriseAnimations={isEnterprise}
            isLiveSite={isLiveSite}
          />
        </ErrorBoundary>
      );
    } catch (error) {
      console.error(`❌ PageCanvas: Error rendering element ${element.id}:`, error);
      return (
        <div key={element.id} className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
          <p className="font-medium">Error rendering {element.type} element</p>
          <p className="text-sm mt-1">{String(error)}</p>
        </div>
      );
    }
  };

  return (
    <ScrollArea className="h-full w-full">
      <div 
        className={`builder-canvas min-h-screen p-6 ${isPreviewMode ? 'preview-mode' : ''} ${canvasVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.2s ease-in-out' }}
        ref={canvasRef}
        data-builder-canvas
        data-canvas-container="true"
      >
        <div className="page-content max-w-full">
          {elements && elements.length > 0 ? (
            <div className="space-y-4">
              {elements.map((element, index) => renderElementSafely(element, index))}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px] text-gray-400 p-4">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p>No elements added to this page yet</p>
                {!isPreviewMode && !isLiveSite && (
                  <p className="text-sm mt-2">Drag elements from the sidebar to get started</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
});

PageCanvas.displayName = 'PageCanvas';

export default PageCanvas;
