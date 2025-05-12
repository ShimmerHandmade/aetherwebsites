
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import { renderElement } from "../renderElement";
import CanvasDragDropHandler from "../../canvas/CanvasDragDropHandler";
import { ElementWrapper } from "../ElementWrapper";
import { useBuilder } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ContainerElement: React.FC<ElementProps> = ({ element }) => {
  const { selectedElementId } = useBuilder();
  const padding = element.props?.padding === 'large' ? 'p-8' : 
                element.props?.padding === 'small' ? 'p-2' : 'p-4';
  const background = element.props?.background === 'gray' ? 'bg-gray-50' : 
                    element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white';

  return (
    <div className={`${padding} ${background} border border-dashed border-gray-300 rounded-md relative min-h-[100px]`}>
      {element.content && <div className="mb-4">{element.content}</div>}
      
      <CanvasDragDropHandler
        isPreviewMode={false}
        onCanvasClick={(e) => e.stopPropagation()}
        className="min-h-[80px] w-full"
        containerId={element.id}
      >
        {element.children && element.children.length > 0 ? (
          <div className="space-y-4">
            {element.children.map((child, index) => (
              <div key={child.id}>
                <ElementWrapper 
                  element={child} 
                  index={index} 
                  selected={child.id === selectedElementId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Drop elements here to create content
          </div>
        )}
      </CanvasDragDropHandler>
    </div>
  );
};

export default ContainerElement;
