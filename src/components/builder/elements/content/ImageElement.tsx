
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
        console.log("Image failed to load:", src);
        // Try to extract filename from path to check if it's a template image
        const pathParts = src.split('/');
        const filename = pathParts[pathParts.length - 1];
        
        // If it's a template image, try the remote URL option
        if (src.includes('/templates/') && !src.startsWith('http')) {
          const templateId = filename.split('.')[0]; // Get template id without extension
          console.log(`Trying to find alternative image for template: ${templateId}`);
          
          // This is a simple check to see if this might be a template image
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
              e.currentTarget.src = `${unsplashUrls[templateId as keyof typeof unsplashUrls]}?q=80&w=1470&auto=format&fit=crop`;
              return;
            }
          }
        }
        
        // Fallback if image doesn't load or no alternative found
        e.currentTarget.src = "/placeholder.svg";
      }}
    />
  );
};

export default ImageElement;
