
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  const src = element.props?.src || '';
  const alt = element.props?.alt || '';
  
  return (
    <div className="p-4">
      <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', src);
              e.currentTarget.src = '/placeholder.svg'; // Fallback image
            }}
          />
        ) : (
          <span className="text-gray-500">Image placeholder</span>
        )}
      </div>
    </div>
  );
};

export default ImageElement;
