
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import BuilderElement from "../BuilderElement";
import EmptyCanvasPlaceholder from "./EmptyCanvasPlaceholder";

interface PageCanvasProps {
  isPreviewMode: boolean;
}

const PageCanvas: React.FC<PageCanvasProps> = ({ isPreviewMode }) => {
  const { elements, selectedElementId } = useBuilder();

  // Add a wavy divider SVG at the bottom (Squarespace-style)
  const wavyDivider = (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] text-white"
      >
        <path
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );

  return (
    <div className="w-full h-full">
      {elements.length > 0 ? (
        <div className="page-content">
          <div className="relative py-20 bg-gradient-to-b from-purple-300 to-purple-200 mb-32">
            <div className="container mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Handmade, Eco-Friendly Self-Care Items
              </h1>
            </div>
            {wavyDivider}
          </div>
          
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
    </div>
  );
};

export default PageCanvas;
