
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ContainerElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className={`p-${element.props?.padding === 'large' ? '8' : element.props?.padding === 'medium' ? '4' : '2'} ${
      element.props?.background === 'gray' ? 'bg-gray-50' : 
      element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    } border border-dashed border-gray-300`}>
      {element.content || "Container - Add elements inside"}
    </div>
  );
};

export default ContainerElement;
