
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FaqElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4 border rounded mb-2">
      <h3 className="font-medium mb-2">{element.content || "Frequently Asked Question"}</h3>
      <p className="text-gray-600">{element.props?.answer || "Answer to the question goes here."}</p>
    </div>
  );
};

export default FaqElement;
