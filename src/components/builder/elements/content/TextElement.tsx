
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { cn } from "@/lib/utils";

interface ElementProps {
  element: BuilderElement;
}

const TextElement: React.FC<ElementProps> = ({ element }) => {
  const content = element.content || element.props?.text || "Add your text here";
  
  // Extract styling properties from props
  const { 
    fontSize = "base", 
    fontWeight = "normal", 
    textAlign = "left", 
    textColor = "default",
    whitespacePreLine 
  } = element.props || {};
  
  // Build the class name based on the properties
  const className = cn(
    // Font size classes
    {
      "text-xs": fontSize === "xs",
      "text-sm": fontSize === "sm",
      "text-base": fontSize === "base",
      "text-lg": fontSize === "lg",
      "text-xl": fontSize === "xl",
      "text-2xl": fontSize === "2xl",
      "text-3xl": fontSize === "3xl",
    },
    // Font weight classes
    {
      "font-normal": fontWeight === "normal",
      "font-medium": fontWeight === "medium",
      "font-semibold": fontWeight === "semibold",
      "font-bold": fontWeight === "bold",
    },
    // Text alignment classes
    {
      "text-left": textAlign === "left",
      "text-center": textAlign === "center",
      "text-right": textAlign === "right",
      "text-justify": textAlign === "justify",
    },
    // Text color classes
    {
      "text-gray-800": textColor === "default",
      "text-primary": textColor === "primary",
      "text-secondary": textColor === "secondary",
      "text-gray-500": textColor === "muted",
    },
    // Add any custom classes
    element.props?.className || ""
  );
  
  // Support for whitespace-pre-line if specified in props
  const textStyle = whitespacePreLine ? { whiteSpace: "pre-line" as const } : {};
  
  return (
    <p className={className} style={textStyle}>
      {content}
    </p>
  );
};

export default TextElement;
