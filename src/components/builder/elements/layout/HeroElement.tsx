
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const HeroElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="py-12 px-4 bg-indigo-50 text-center">
      <h1 className="text-3xl font-bold mb-4">{element.content || "Hero Title"}</h1>
      <p className="text-gray-600 mb-6">This is a hero section. Click to edit.</p>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded">
        Call to Action
      </button>
    </div>
  );
};

export default HeroElement;
