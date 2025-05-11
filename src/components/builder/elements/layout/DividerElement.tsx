
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const DividerElement: React.FC<ElementProps> = ({ element }) => {
  const color = element.props?.color === 'dark' ? 'border-gray-700' : 
               element.props?.color === 'light' ? 'border-gray-100' : 'border-gray-300';
  
  return <div className={`border-t ${color} my-4 w-full`}></div>;
};

export default DividerElement;
