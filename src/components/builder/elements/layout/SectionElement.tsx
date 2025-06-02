
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import CanvasDragDropHandler from "../../canvas/CanvasDragDropHandler";
import { ElementWrapper } from "../ElementWrapper";
import { useBuilder } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const SectionElement: React.FC<ElementProps> = ({ element }) => {
  const { selectedElementId, selectElement } = useBuilder();
  
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
  
  // Handle click on the section element
  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };
  
  return (
    <div 
      id={element.props?.id} 
      className={`px-4 ${backgroundColor} ${padding} ${additionalClasses} w-full border border-dashed border-gray-300 hover:border-blue-300 transition-colors relative`}
      onClick={handleSectionClick}
      data-element-id={element.id}
    >
      {title && <h2 className={`text-2xl font-bold mb-6 text-center ${textColor}`}>{title}</h2>}
      
      <CanvasDragDropHandler
        isPreviewMode={false}
        onCanvasClick={(e) => e.stopPropagation()}
        className="min-h-[200px] w-full"
        parentId={element.id}
      >
        {element.children && element.children.length > 0 ? (
          <div className="space-y-4">
            {element.children.map((child, index) => (
              <div key={child.id} className="relative">
                <ElementWrapper 
                  element={child} 
                  index={index} 
                  selected={child.id === selectedElementId}
                  parentId={element.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[150px]">
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 w-full">
              <p className="text-gray-500 text-lg font-medium mb-2">Drop Elements Here</p>
              <p className="text-gray-400 text-sm">Drag components from the sidebar to build your section</p>
            </div>
          </div>
        )}
      </CanvasDragDropHandler>
    </div>
  );
};

export default SectionElement;
