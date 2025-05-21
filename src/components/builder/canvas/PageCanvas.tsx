
import React, { useState, useEffect, useRef, memo } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement } from "@/contexts/builder/types";
import { ElementWrapper } from "../elements";
import { usePlan } from "@/contexts/PlanContext";

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
  const { isPremium, isEnterprise, loading: planLoading, error: planError } = usePlan();
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Single effect for stable rendering
  useEffect(() => {
    // Set visible state once and don't change it to prevent flicker
    const timer = setTimeout(() => {
      setCanvasVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Report errors up to parent component
  useEffect(() => {
    if (planError && onError) {
      console.error("Plan error detected in PageCanvas:", planError);
      onError();
    }
  }, [planError, onError]);

  // Handle error state
  if (loadingFailed) {
    return (
      <div className="builder-canvas">
        <div className="page-content">
          <div className="flex items-center justify-center min-h-[300px] p-4">
            <div className="text-center max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load content</h3>
              <p className="text-gray-500 mb-4">We're having trouble loading the page elements.</p>
              {!isPreviewMode && !isLiveSite && (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Refresh Page
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`builder-canvas ${isPreviewMode ? 'preview-mode' : ''} ${canvasVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ minHeight: '50vh', transition: 'opacity 0.2s ease-in-out' }}
      ref={canvasRef}
    >
      <div className="page-content">
        {elements && elements.length > 0 ? (
          elements.map((element, index) => (
            <ElementWrapper 
              key={element.id} 
              element={element}
              index={index}
              selected={selectedElementId === element.id}
              isPreviewMode={isPreviewMode}
              canUseAnimations={isPremium || isEnterprise}
              canUseEnterpriseAnimations={isEnterprise}
              isLiveSite={isLiveSite}
            />
          ))
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
  );
});

// Add display name for React DevTools
PageCanvas.displayName = 'PageCanvas';

export default PageCanvas;
