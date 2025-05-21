
import React, { useState, useEffect } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ElementProps {
  element: BuilderElement;
}

const ImageElement: React.FC<ElementProps> = ({ element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  
  const initialSrc = element.props?.src || "/placeholder.svg";
  const alt = element.props?.alt || "Image";
  const className = element.props?.className || "rounded";
  
  // Preload image to prevent flickering
  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    
    // Reset source when element prop changes
    setImageSrc(initialSrc);
    
    // Preload image
    const img = new Image();
    img.src = initialSrc;
    
    img.onload = () => {
      setIsLoading(false);
      setImageSrc(initialSrc);
    };
    
    img.onerror = () => {
      handleImageError(initialSrc);
    };
    
    return () => {
      // Clean up by removing event listeners
      img.onload = null;
      img.onerror = null;
    };
  }, [initialSrc]);

  const handleImageError = (src: string) => {
    console.log("Image failed to load:", src);
    setLoadError(true);
    
    // Try to extract filename from path to check if it's a template image
    const pathParts = src.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // If it's a template image, try the remote URL option
    if (src.includes('/templates/') && !src.startsWith('http')) {
      const templateId = filename.split('.')[0]; // Get template id without extension
      console.log(`Trying to find alternative image for template: ${templateId}`);
      
      // Check if this might be a template image
      if (['beauty', 'electronics', 'fashion', 'furniture', 'food', 'jewelry'].includes(templateId)) {
        // Try unsplash as backup for templates
        const unsplashUrls = {
          'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
          'electronics': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
          'fashion': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
          'furniture': 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89',
          'food': 'https://images.unsplash.com/photo-1526470498-9ae73c665de8',
          'jewelry': 'https://images.unsplash.com/photo-1581252517866-6c03232384a4'
        };
        
        if (unsplashUrls[templateId as keyof typeof unsplashUrls]) {
          const unsplashSrc = `${unsplashUrls[templateId as keyof typeof unsplashUrls]}?q=80&w=1470&auto=format&fit=crop`;
          setImageSrc(unsplashSrc);
          setIsLoading(false);
          return;
        }
      }
    }
    
    // Fallback if no alternative found
    setImageSrc("/placeholder.svg");
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-full min-h-[100px] bg-gray-200 rounded" />
      )}
      
      {/* Render image when available */}
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt={alt} 
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            // Only trigger error handler if this isn't already a fallback image
            if (imageSrc !== "/placeholder.svg") {
              handleImageError(imageSrc);
            } else {
              setIsLoading(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default ImageElement;
