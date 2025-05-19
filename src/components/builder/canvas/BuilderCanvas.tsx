
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
  const { elements, selectElement } = useBuilder();
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle direct canvas clicks (not bubbled from elements)
    if (e.target === e.currentTarget) {
      // Deselect any element when clicking the canvas directly
      selectElement(null);
    }
  };

  return (
    <div className="w-full min-h-screen pb-20 relative">
      {!isPreviewMode && (
        <CanvasDragDropHandler 
          isPreviewMode={isPreviewMode}
          onCanvasClick={handleCanvasClick}
          className="w-full min-h-screen"
        >
          {/* Content to be wrapped by the drag-drop handler */}
          {elements.length === 0 ? (
            <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
          ) : (
            <PageCanvas elements={elements} isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
          )}
        </CanvasDragDropHandler>
      )}
      
      {/* When in preview mode, we directly render without the drag-drop handler */}
      {isPreviewMode && (
        elements.length === 0 ? (
          <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
        ) : (
          <PageCanvas elements={elements} isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
        )
      )}
    </div>
  );
};

export default BuilderCanvas;
