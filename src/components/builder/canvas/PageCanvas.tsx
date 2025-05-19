
import React from "react";
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
  const { isPremium, isEnterprise } = usePlan();

  return (
    <div className={`builder-canvas ${isPreviewMode ? 'preview-mode' : ''}`}>
      <div className="page-content">
        {elements.map((element, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default PageCanvas;
