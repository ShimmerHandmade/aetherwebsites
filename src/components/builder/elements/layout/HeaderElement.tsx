
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const HeaderElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <h2 className="text-xl font-medium">{element.content || "Header"}</h2>
    </div>
  );
};

export default HeaderElement;
