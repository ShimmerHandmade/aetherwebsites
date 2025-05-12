
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  const src = element.props?.src || "/placeholder.svg";
  const alt = element.props?.alt || "Image";
  const className = element.props?.className || "rounded";
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => {
        // Fallback if image doesn't load
        e.currentTarget.src = "/placeholder.svg";
      }}
    />
  );
};

export default ImageElement;
