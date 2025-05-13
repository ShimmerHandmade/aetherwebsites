
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ScaleInElementProps {
  element: BuilderElement;
}

const ScaleInElement: React.FC<ScaleInElementProps> = ({ element }) => {
  const { content, props } = element;
  
  return (
    <div className="p-4 animate-scale-in">
      {content || props?.content || "Scale In Element"}
    </div>
  );
};

export default ScaleInElement;
