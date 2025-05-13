
import React from 'react';
import { useBuilder } from '@/contexts/builder';
import EmptyCanvasPlaceholder from './EmptyCanvasPlaceholder';
import PageCanvas from './PageCanvas';
import { usePlan } from '@/contexts/PlanContext';

interface BuilderCanvasProps {
  isPreviewMode?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ isPreviewMode = false }) => {
  const { elements, selectedElementId } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();

  const isEmpty = elements.length === 0;

  // Check if premium animations are allowed based on the user's plan
  const canUseAnimations = isPremium || isEnterprise;
  const canUseEnterpriseAnimations = isEnterprise;

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      {isEmpty ? (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      ) : (
        <PageCanvas 
          isPreviewMode={isPreviewMode}
          canUseAnimations={canUseAnimations}
          canUseEnterpriseAnimations={canUseEnterpriseAnimations}
        />
      )}
    </div>
  );
};

export default BuilderCanvas;
