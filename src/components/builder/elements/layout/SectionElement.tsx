
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";

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
  
  // Text color from props
  const textColor = element.props?.textColor || '';
  
  // Get additional className if provided
  const additionalClasses = element.props?.className || '';
  
  return (
    <div id={element.props?.id} className={`px-4 ${backgroundColor} ${padding} ${additionalClasses}`}>
      {title && <h2 className={`text-2xl font-bold mb-6 text-center ${textColor}`}>{title}</h2>}
      
      {/* If there are children, they'll be rendered by the BuilderContent component */}
      {!element.children && (
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-600 mb-4">
            This section can contain various elements like text, images, or other components.
            Add elements from the sidebar to build your content.
          </p>
          <div className="border border-dashed border-gray-300 p-8 text-center rounded-lg bg-gray-50">
            <span className="text-gray-500">Content area - Drag and drop elements here</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionElement;
