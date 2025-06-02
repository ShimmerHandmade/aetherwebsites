
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import CanvasDragDropHandler from "../../canvas/CanvasDragDropHandler";
import { ElementWrapper } from "../ElementWrapper";
import { useBuilder } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ContainerElement: React.FC<ElementProps> = ({ element }) => {
  const { selectedElementId, selectElement } = useBuilder();
  
  // Extract container properties with defaults
  const padding = element.props?.padding === 'large' ? 'p-8' : 
                element.props?.padding === 'small' ? 'p-2' : 'p-4';
  
  const background = element.props?.background === 'gray' ? 'bg-gray-50' : 
                    element.props?.background === 'light' ? 'bg-gray-100' :
                    element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 
                    element.props?.background === 'primary' ? 'bg-blue-600 text-white' :
                    element.props?.background === 'secondary' ? 'bg-purple-600 text-white' :
                    element.props?.background === 'transparent' ? 'bg-transparent' :
                    'bg-white';
  
  const maxWidth = element.props?.maxWidth || '100%';
  const center = element.props?.center ? 'mx-auto' : '';
  const borderRadius = element.props?.borderRadius === 'sm' ? 'rounded-sm' :
                      element.props?.borderRadius === 'md' ? 'rounded-md' :
                      element.props?.borderRadius === 'lg' ? 'rounded-lg' :
                      element.props?.borderRadius === 'full' ? 'rounded-full' :
                      'rounded-none';
  
  const customClass = element.props?.customClass || '';

  // Handle click on the container element
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  return (
    <div 
      className={`${padding} ${background} ${borderRadius} border border-dashed border-gray-300 hover:border-blue-300 transition-colors relative min-h-[120px] ${customClass}`}
      onClick={handleContainerClick}
      data-element-id={element.id}
      style={{ maxWidth, width: '100%' }}
    >
      <div className={`w-full ${center}`}>
        {element.content && <div className="mb-4">{element.content}</div>}
        
        <CanvasDragDropHandler
          isPreviewMode={false}
          onCanvasClick={(e) => e.stopPropagation()}
          className="min-h-[80px] w-full"
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
            <div className="flex items-center justify-center h-full min-h-[80px]">
              <div className="text-center py-6 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 w-full">
                <p className="text-gray-500 font-medium">Drop elements here</p>
                <p className="text-gray-400 text-sm mt-1">Create content inside this container</p>
              </div>
            </div>
          )}
        </CanvasDragDropHandler>
      </div>
    </div>
  );
};

export default ContainerElement;
