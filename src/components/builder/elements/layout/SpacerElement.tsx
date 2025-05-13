
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const SpacerElement: React.FC<ElementProps> = ({ element }) => {
  // Use predefined classes instead of dynamic ones
  const heightClass = element.props?.height === 'small' ? 'h-4' : 
                element.props?.height === 'large' ? 'h-16' : 'h-8';
  
  return <div className={`${heightClass} w-full`}></div>;
};

export default SpacerElement;
