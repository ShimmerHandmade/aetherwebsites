
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import BuilderElement from "../BuilderElement";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";

interface PageCanvasProps {
  isPreviewMode: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ isPreviewMode }) => {
  const { elements } = useBuilder();

  return (
    <div className="w-full h-full">
      {elements.length > 0 ? (
        <div className="page-content">
          {elements.map((element, index) => (
            <BuilderElement
              key={element.id}
              element={element}
              index={index}
              selected={false}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </div>
      ) : (
        <EmptyCanvasPlaceholder isPreviewMode={isPreviewMode} />
      )}
    </div>
  );
};

export default PageCanvas;
