
import React, { useState } from "react";
import { usePlan } from "@/contexts/PlanContext";
import PageCanvas from "./PageCanvas";
import CanvasDragDropHandler from "./CanvasDragDropHandler";
import { useBuilder } from "@/contexts/builder/BuilderProvider";

const BuilderCanvas: React.FC<{isPreviewMode: boolean}> = ({ isPreviewMode }) => {
  const { isPremium, isEnterprise } = usePlan();
  const { setSelectedElementId } = useBuilder();
  
  // Pass animation flags based on the user's plan
  const canUseAnimations = isPremium || isEnterprise;
  const canUseEnterpriseAnimations = isEnterprise;
  
  // Handle canvas click to clear selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isPreviewMode && e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };
  
  return (
    <CanvasDragDropHandler 
      isPreviewMode={isPreviewMode}
      onCanvasClick={handleCanvasClick}
      className="builder-canvas w-full h-full overflow-auto bg-white"
    >
      <PageCanvas 
        isPreviewMode={isPreviewMode}
        canUseAnimations={canUseAnimations}
        canUseEnterpriseAnimations={canUseEnterpriseAnimations}
      />
    </CanvasDragDropHandler>
  );
};

export default BuilderCanvas;
