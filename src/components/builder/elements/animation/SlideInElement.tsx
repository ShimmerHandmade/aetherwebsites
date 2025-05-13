
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface SlideInElementProps {
  element: BuilderElement;
}

const SlideInElement: React.FC<SlideInElementProps> = ({ element }) => {
  const { content, props } = element;
  
  return (
    <div className="p-4 animate-slide-in-right">
      {content || props?.content || "Slide In Element"}
    </div>
  );
};

export default SlideInElement;
