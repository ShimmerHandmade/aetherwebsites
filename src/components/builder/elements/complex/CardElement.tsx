
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const CardElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h3 className="font-medium text-lg mb-3">{element.content || "Card Title"}</h3>
      <p className="text-gray-600">{element.props?.description || "Card description goes here."}</p>
      {element.props?.showButton && (
        <button className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded">Learn More</button>
      )}
    </div>
  );
};

export default CardElement;
