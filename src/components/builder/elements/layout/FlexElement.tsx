
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
  
  return (
    <div className={`flex ${direction} ${justify} ${align} p-4 border border-dashed border-gray-300`}>
      <div className="bg-gray-100 p-4 m-2">Flex Item 1</div>
      <div className="bg-gray-100 p-4 m-2">Flex Item 2</div>
    </div>
  );
};

export default FlexElement;
