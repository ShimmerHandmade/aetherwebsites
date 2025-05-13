
import React from "react";
import { useBuilder } from "@/contexts/builder/BuilderProvider";
import CanvasDragDropHandler from "./CanvasDragDropHandler";
import PageCanvas from "./PageCanvas";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";

interface BuilderCanvasProps {
  isPreviewMode?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ isPreviewMode = false }) => {
  const { elements, setSelectedElementId, selectedElementId } = useBuilder();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target && !isPreviewMode) {
      setSelectedElementId(null);
    }
  };

  const canvasClassName = `${isPreviewMode ? '' : 'bg-white rounded-lg shadow-sm border border-gray-200'} relative ${
    isPreviewMode ? 'min-h-screen' : 'min-h-[800px]'
  }`;

  return (
    <CanvasDragDropHandler
      isPreviewMode={isPreviewMode}
      onCanvasClick={handleCanvasClick}
      className={canvasClassName}
    >
      {elements.length > 0 ? (
        <PageCanvas isPreviewMode={isPreviewMode} />
      ) : (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      )}
    </CanvasDragDropHandler>
  );
};

export default BuilderCanvas;
