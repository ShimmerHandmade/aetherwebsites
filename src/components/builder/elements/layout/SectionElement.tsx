
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const SectionElement: React.FC<ElementProps> = ({ element }) => {
  // Extract properties with defaults
  const title = element.props?.title || element.content || "Section Title";
  const backgroundColor = 
    element.props?.background === 'gray' ? 'bg-gray-50' : 
    element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 
    element.props?.backgroundColor || 'bg-white';
  
  // Get padding and other styling classes
  const padding = element.props?.padding === 'small' ? 'py-6' :
                 element.props?.padding === 'large' ? 'py-16' : 'py-12';
  
  // Get additional className if provided
  const additionalClasses = element.props?.className || '';
  
  return (
    <div id={element.props?.id} className={`px-4 ${backgroundColor} ${padding} ${additionalClasses}`}>
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}
      
      {/* If there are children, they'll be rendered by the BuilderContent component */}
      {!element.children && (
        <div className="border border-dashed border-gray-300 p-4 text-center">
          Section content area
        </div>
      )}
    </div>
  );
};

export default SectionElement;
