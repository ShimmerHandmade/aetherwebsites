
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import CanvasDragDropHandler from "./CanvasDragDropHandler";
import PageCanvas from "./PageCanvas";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";

interface BuilderCanvasProps {
  isPreviewMode?: boolean;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ isPreviewMode = false }) => {
  const { elements, selectElement, selectedElementId } = useBuilder();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target && !isPreviewMode) {
      selectElement(null);
    }
  };

  const canvasClassName = `${isPreviewMode ? '' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'} relative ${
    isPreviewMode ? 'min-h-screen' : 'min-h-[800px]'
  }`;

  return (
    <CanvasDragDropHandler
      isPreviewMode={isPreviewMode}
      onCanvasClick={handleCanvasClick}
      className={canvasClassName}
    >
      {elements.length > 0 ? (
        elements.map((element, index) => (
          <BuilderElement
            key={element.id}
            element={element}
            index={index}
            selected={!isPreviewMode && selectedElementId === element.id}
            isPreviewMode={isPreviewMode}
          />
        ))
      ) : (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      )}
    </CanvasDragDropHandler>
  );
};

export default BuilderCanvas;
