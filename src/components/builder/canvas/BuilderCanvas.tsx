
import React, { useState, useEffect } from 'react';
import { useBuilder } from '@/contexts/builder';
import { usePlan } from '@/contexts/PlanContext';
import { cn } from '@/lib/utils';
import { PageCanvas } from './PageCanvas';

interface BuilderCanvasProps {
  isPreviewMode?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ isPreviewMode = false }) => {
  const { elements, isDraggingOver } = useBuilder();
  const { isPremium, isEnterprise } = usePlan();
  const [hasAnimation, setHasAnimation] = useState(false);
  
  // Determine if premium animations are available
  useEffect(() => {
    const canUseAnimations = isPremium || isEnterprise;
    setHasAnimation(canUseAnimations);
  }, [isPremium, isEnterprise]);

  return (
    <div 
      className={cn(
        "w-full p-4 bg-white shadow-lg rounded-md transition-all duration-300",
        isDraggingOver && "bg-blue-50 border-2 border-dashed border-blue-300",
        hasAnimation && "animate-fade-in"
      )}
    >
      <PageCanvas isPreviewMode={isPreviewMode} />
      
      {/* Show premium animation indicator for appropriate plans */}
      {hasAnimation && !isPreviewMode && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded">
          Premium animations enabled
        </div>
      )}
    </div>
  );
};

export default BuilderCanvas;
