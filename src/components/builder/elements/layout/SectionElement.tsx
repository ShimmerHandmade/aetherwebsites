
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const SectionElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className={`py-12 px-4 ${
      element.props?.background === 'gray' ? 'bg-gray-50' : 
      element.props?.background === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    }`}>
      <h2 className="text-2xl font-bold mb-6 text-center">{element.content || "Section Title"}</h2>
      <div className="border border-dashed border-gray-300 p-4 text-center">
        Section content area
      </div>
    </div>
  );
};

export default SectionElement;
