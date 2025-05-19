
import React from "react";
import PageCanvas from "./PageCanvas";
import { useBuilder } from "@/contexts/builder/useBuilder";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";
import CanvasDragDropHandler from "./CanvasDragDropHandler";

interface BuilderCanvasProps {
  isPreviewMode: boolean;
  isLiveSite?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { elements } = useBuilder();

  return (
    <div className="w-full min-h-screen pb-20 relative">
      {!isPreviewMode && <CanvasDragDropHandler />}
      
      {elements.length === 0 ? (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      ) : (
        <PageCanvas elements={elements} isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
      )}
    </div>
  );
};

export default BuilderCanvas;
