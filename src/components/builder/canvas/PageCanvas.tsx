
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import BuilderElement from "../BuilderElement";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";

interface PageCanvasProps {
  isPreviewMode: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ isPreviewMode }) => {
  const { elements, selectedElementId } = useBuilder();

  return (
    <div className="w-full h-full bg-white">
      {elements.length > 0 ? (
        <div className="page-content">
          {elements.map((element, index) => (
            <BuilderElement
              key={element.id}
              element={element}
              index={index}
              selected={element.id === selectedElementId}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>
      ) : (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      )}
      
      {/* Add hover indicators for sections when not in preview mode */}
      {!isPreviewMode && elements.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="section-indicators"></div>
        </div>
      )}
    </div>
  );
};

export default PageCanvas;
