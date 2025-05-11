
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const TextElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <p>{element.content || "Text block. Click to edit."}</p>
    </div>
  );
};

export default TextElement;
