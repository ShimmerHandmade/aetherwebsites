
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const SpacerElement: React.FC<ElementProps> = ({ element }) => {
  const height = element.props?.height === 'small' ? '4' : 
                element.props?.height === 'large' ? '16' : '8';
  
  return <div className={`h-${height} w-full`}></div>;
};

export default SpacerElement;
