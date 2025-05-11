
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ButtonElement: React.FC<ElementProps> = ({ element }) => {
  const buttonVariant = element.props?.variant || 'primary';
  
  return (
    <div className="p-4">
      <button className={`px-4 py-2 rounded hover:opacity-90 ${
        buttonVariant === 'primary' ? 'bg-indigo-600 text-white' : 
        buttonVariant === 'secondary' ? 'bg-gray-200 text-gray-800' :
        buttonVariant === 'outline' ? 'border border-indigo-600 text-indigo-600' :
        'bg-indigo-600 text-white'
      }`}>
        {element.content || "Button"}
      </button>
    </div>
  );
};

export default ButtonElement;
