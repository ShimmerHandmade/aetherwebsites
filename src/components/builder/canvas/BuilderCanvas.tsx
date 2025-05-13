
import React from 'react';
import { useBuilder } from '@/contexts/builder';
import EmptyCanvasPlaceholder from './EmptyCanvasPlaceholder';
import PageCanvas from './PageCanvas';
import { usePlan } from '@/contexts/PlanContext';

const BuilderCanvas = () => {
  const { elements, selectedElementId } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();

  const isEmpty = elements.length === 0;

  // Check if premium animations are allowed based on the user's plan
  const canUseAnimations = isPremium || isEnterprise;
  const canUseEnterpriseAnimations = isEnterprise;

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      {isEmpty ? (
        <EmptyCanvasPlaceholder />
      ) : (
        <PageCanvas 
          canUseAnimations={canUseAnimations}
          canUseEnterpriseAnimations={canUseEnterpriseAnimations}
        />
      )}
    </div>
  );
};

export default BuilderCanvas;
