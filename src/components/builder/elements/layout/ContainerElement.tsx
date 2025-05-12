
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import { renderElement } from "../renderElement";

interface ElementProps {
  element: BuilderElement;
}

const ContainerElement: React.FC<ElementProps> = ({ element }) => {
  const padding = element.props?.padding === 'large' ? 'p-8' : 
                element.props?.padding === 'small' ? 'p-2' : 'p-4';
  const background = element.props?.background === 'gray' ? 'bg-gray-50' : 
                    element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white';

  return (
    <div className={`${padding} ${background} border border-dashed border-gray-300 rounded-md`}>
      {element.content && <div className="mb-4">{element.content}</div>}
      
      {element.children && element.children.length > 0 ? (
        <div className="space-y-4">
          {element.children.map((child) => (
            <div key={child.id}>
              {renderElement(child)}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          Drop elements here to create a layout
        </div>
      )}
    </div>
  );
};

export default ContainerElement;
