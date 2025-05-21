import React, { useEffect, useState } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement } from "@/contexts/builder/types";
import { ElementWrapper } from "../elements";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

interface PageCanvasProps {
  elements: BuilderElement[];
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ 
  elements, 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { selectedElementId } = useBuilder();
  const { isPremium, isEnterprise, loading: planLoading } = usePlan();
  const [isRendering, setIsRendering] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Enhanced debug logging to help identify plan status and element loading
  useEffect(() => {
    console.log("PageCanvas rendering with plan status:", { 
      isPremium, 
      isEnterprise,
      planLoading,
      elementsCount: elements?.length || 0,
      isPreviewMode,
      isLiveSite,
      retryCount
    });
    
    // Use a progressive loading strategy
    const renderWithRetry = () => {
      // If we have elements, show them after a small delay
      if (elements && elements.length > 0) {
        const timer = setTimeout(() => {
          setIsRendering(false);
          setLoadingFailed(false);
        }, 500);
        return () => clearTimeout(timer);
      } 
      // If we don't have elements but have tried fewer than 3 times
      else if (retryCount < 3) {
        // Wait longer on each retry
        const delayTime = 500 + (retryCount * 500);
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          // Keep rendering state true while retrying
        }, delayTime);
        return () => clearTimeout(timer);
      } 
      // If we've tried 3 times and still no elements
      else {
        const timer = setTimeout(() => {
          setIsRendering(false);
          // Only show loading failed if we really don't have elements after retries
          if (!elements || elements.length === 0) {
            setLoadingFailed(true);
            // Only show toast if not in preview mode
            if (!isPreviewMode && !isLiveSite) {
              toast.error("Unable to load page elements. Try refreshing the page.");
            }
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    return renderWithRetry();
  }, [isPremium, isEnterprise, planLoading, elements, isPreviewMode, isLiveSite, retryCount]);

  // Show loading state while elements are being prepared
  if (isRendering) {
    return (
      <div className="builder-canvas">
        <div className="page-content">
          <div className="flex items-center justify-center min-h-[300px] p-4">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading page elements...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if loading failed
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
              <p className="text-gray-500 mb-4">We're having trouble loading the page elements. This might be due to network issues or template problems.</p>
              {!isPreviewMode && !isLiveSite && (
                <button 
                  onClick={() => {
                    setIsRendering(true);
                    setRetryCount(0);
                    window.location.reload();
                  }}
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
    <div className={`builder-canvas ${isPreviewMode ? 'preview-mode' : ''}`}>
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
};

export default PageCanvas;
