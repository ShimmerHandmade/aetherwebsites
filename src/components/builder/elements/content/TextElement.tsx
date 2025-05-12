
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const TextElement: React.FC<ElementProps> = ({ element }) => {
  const content = element.content || element.props?.text || "Add your text here";
  const className = element.props?.className || "";
  
  // Support for whitespace-pre-line if specified in props
  const textStyle = element.props?.whitespacePreLine ? { whiteSpace: "pre-line" } : {};
  
  return (
    <p className={className} style={textStyle}>
      {content}
    </p>
  );
};

export default TextElement;
