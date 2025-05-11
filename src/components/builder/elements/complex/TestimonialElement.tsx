
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const TestimonialElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <p className="text-gray-700 mb-4 italic">"{element.content}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <p className="font-medium">{element.props?.author || "Anonymous"}</p>
          <p className="text-sm text-gray-500">{element.props?.role || "Customer"}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialElement;
