
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface FadeInElementProps {
  element: BuilderElement;
}

const FadeInElement: React.FC<FadeInElementProps> = ({ element }) => {
  const { content, props } = element;
  
  return (
    <div className="p-4 animate-fade-in">
      {content || props?.content || "Fade In Element"}
    </div>
  );
};

export default FadeInElement;
