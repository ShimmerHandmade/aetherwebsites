import React, { useState, useEffect } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ElementProps {
  element: BuilderElement;
}

// Helper function to format URLs for images
const formatImageUrl = (src: string): string => {
  if (!src) return '';
  
  // If it's an absolute URL already or a data URL, return as is
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }
  
  // If it starts with a slash, prepend the current website domain
  if (src.startsWith('/')) {
    const origin = window.location.origin;
    return `${origin}${src}`;
  }
  
  // Otherwise, add https:// prefix
  return `https://${src}`;
};

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  const src = element.props?.src || '';
  const alt = element.props?.alt || '';
  const [formattedSrc, setFormattedSrc] = useState<string>(formatImageUrl(src));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Update formatted source when src changes
  useEffect(() => {
    if (src) {
      setFormattedSrc(formatImageUrl(src));
      setIsLoading(true);
      setHasError(false);
    } else {
      setFormattedSrc('');
      setIsLoading(false);
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
      <div className={`bg-gray-100 h-48 flex items-center justify-center overflow-hidden relative rounded-md ${
        hasError ? 'border-2 border-red-300' : ''
      }`}>
        {!formattedSrc && (
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500 block">Image placeholder</span>
            <span className="text-xs text-gray-400 block mt-1">Upload an image or set URL</span>
          </div>
        )}
        
        {formattedSrc && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="h-10 w-10 border-4 border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
          </div>
        )}
        
        {formattedSrc && (
          <img 
            src={formattedSrc} 
            alt={alt} 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 bg-red-50 bg-opacity-80 z-20">
            <ImageIcon className="h-8 w-8 text-red-400 mb-2" />
            <span className="text-sm">Failed to load image</span>
            <span className="text-xs mt-2 max-w-[80%] truncate text-red-400">{formattedSrc}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageElement;
