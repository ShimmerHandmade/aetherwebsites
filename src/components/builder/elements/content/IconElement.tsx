
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const IconElement: React.FC<ElementProps> = ({ element }) => {
  const iconSize = element.props?.size === 'small' ? 'h-4 w-4' : 
                 element.props?.size === 'large' ? 'h-8 w-8' : 'h-6 w-6';
  const iconColor = element.props?.color === 'indigo' ? 'text-indigo-600' :
                  element.props?.color === 'gray' ? 'text-gray-600' : 'text-current';
  
  return (
    <div className="p-4 flex justify-center">
      <div className={`${iconSize} ${iconColor}`}>★</div>
    </div>
  );
};

export default IconElement;
