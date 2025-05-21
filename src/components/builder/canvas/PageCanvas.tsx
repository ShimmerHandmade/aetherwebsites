
import React, { useEffect } from "react";
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
  
  // Debug to help identify plan status
  useEffect(() => {
    console.log("PageCanvas rendering with plan status:", { 
      isPremium, 
      isEnterprise,
      planLoading,
      elementsCount: elements?.length || 0,
      isPreviewMode,
      isLiveSite 
    });
  }, [isPremium, isEnterprise, planLoading, elements, isPreviewMode, isLiveSite]);

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
