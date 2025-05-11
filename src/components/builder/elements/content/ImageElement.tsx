
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        {element.props?.src ? (
          <img src={element.props.src} alt={element.props.alt || ""} className="max-h-full" />
        ) : (
          <span className="text-gray-500">Image placeholder</span>
        )}
      </div>
    </div>
  );
};

export default ImageElement;
