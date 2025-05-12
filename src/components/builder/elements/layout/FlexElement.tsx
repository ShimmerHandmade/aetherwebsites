
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FlexElement: React.FC<ElementProps> = ({ element }) => {
  const direction = element.props?.direction === 'column' ? 'flex-col' : 'flex-row';
  const justify = element.props?.justify === 'between' ? 'justify-between' : 
                  element.props?.justify === 'around' ? 'justify-around' :
                  element.props?.justify === 'end' ? 'justify-end' : 'justify-center';
  const align = element.props?.align === 'start' ? 'items-start' :
              element.props?.align === 'end' ? 'items-end' :
              element.props?.align === 'stretch' ? 'items-stretch' : 'items-center';
  const wrap = element.props?.wrap ? 'flex-wrap' : 'flex-nowrap';
  
  return (
    <div className={`flex ${direction} ${justify} ${align} ${wrap} p-4 gap-4 border border-dashed border-gray-300`}>
      {element.children && element.children.length > 0 ? (
        element.children.map((child, index) => (
          <div key={index} className="flex-1 min-w-0">
            {/* Child elements would be rendered by parent component */}
            <div className="text-center text-gray-400 p-4">Child element placeholder</div>
          </div>
        ))
      ) : (
        <>
          <div className="bg-gray-100 p-4 flex-1">Flex Item 1</div>
          <div className="bg-gray-100 p-4 flex-1">Flex Item 2</div>
        </>
      )}
    </div>
  );
};

export default FlexElement;
