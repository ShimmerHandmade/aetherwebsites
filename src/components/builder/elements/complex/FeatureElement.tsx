
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FeatureElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <span>{element.props?.icon || "★"}</span>
        </div>
        <h3 className="font-medium text-lg mb-2">{element.content}</h3>
        <p className="text-gray-500">{element.props?.description || "Feature description"}</p>
      </div>
    </div>
  );
};

export default FeatureElement;
