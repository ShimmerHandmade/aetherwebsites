
import React from "react";
import { usePlan } from "@/contexts/PlanContext";
import PageCanvas from "./PageCanvas";

const BuilderCanvas: React.FC<{isPreviewMode: boolean}> = ({ isPreviewMode }) => {
  const { isPremium, isEnterprise } = usePlan();
  
  // Pass animation flags based on the user's plan
  const canUseAnimations = isPremium || isEnterprise;
  const canUseEnterpriseAnimations = isEnterprise;
  
  return (
    <div className="builder-canvas w-full h-full overflow-auto bg-white">
      <PageCanvas 
        isPreviewMode={isPreviewMode}
        canUseAnimations={canUseAnimations}
        canUseEnterpriseAnimations={canUseEnterpriseAnimations}
      />
    </div>
  );
};

export default BuilderCanvas;
