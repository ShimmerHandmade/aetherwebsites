
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const CtaElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-8 bg-indigo-50 text-center rounded-lg">
      <h3 className="text-2xl font-bold mb-4">{element.content || "Call to Action"}</h3>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">Take the next step and join thousands of satisfied customers today.</p>
      <button className={`px-6 py-3 rounded-lg text-white ${
        element.props?.buttonVariant === 'secondary' ? 'bg-gray-600' : 'bg-indigo-600'
      }`}>
        {element.props?.buttonText || "Get Started"}
      </button>
    </div>
  );
};

export default CtaElement;
