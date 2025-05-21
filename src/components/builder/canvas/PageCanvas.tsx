
import React, { useEffect, useState } from "react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { BuilderElement } from "@/contexts/builder/types";
import { ElementWrapper } from "../elements";
import { usePlan } from "@/contexts/PlanContext";

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
  
  // Debug to help identify plan status and element loading
  useEffect(() => {
    console.log("PageCanvas rendering with plan status:", { 
      isPremium, 
      isEnterprise,
      planLoading,
      elementsCount: elements?.length || 0,
      isPreviewMode,
      isLiveSite 
    });
    
    // Add a small delay to ensure elements are properly loaded before rendering
    const timer = setTimeout(() => {
      setIsRendering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isPremium, isEnterprise, planLoading, elements, isPreviewMode, isLiveSite]);

  // Show loading state while elements are being prepared
  if (isRendering && (!elements || elements.length === 0)) {
    return (
      <div className="builder-canvas">
        <div className="page-content">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="h-8 w-8 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
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
          <div className="flex items-center justify-center min-h-[300px] text-gray-400">
            No elements added to this page yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PageCanvas;
