
import React, { useState, useEffect } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { toast } from "sonner";

interface ElementProps {
  element: BuilderElement;
}

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  const src = element.props?.src || '';
  const alt = element.props?.alt || '';
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Reset error state when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.error('Image failed to load:', src);
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <div className="p-4">
      <div className={`bg-gray-100 h-48 flex items-center justify-center overflow-hidden relative ${
        hasError ? 'border-2 border-red-300' : ''
      }`}>
        {!src && (
          <span className="text-gray-500">Image placeholder</span>
        )}
        
        {src && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
        
        {src && (
          <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
            <span className="text-sm">Failed to load image</span>
            <span className="text-xs mt-1 max-w-[80%] truncate">{src}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageElement;
