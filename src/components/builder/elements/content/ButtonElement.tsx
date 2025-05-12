
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ButtonElement: React.FC<ElementProps> = ({ element }) => {
  const text = element.content || element.props?.text || "Button";
  const url = element.props?.url || "#";
  
  // Extract variant and size
  const variant = element.props?.variant || "default";
  const size = element.props?.size || "default";
  
  // Generate button classes based on variant and size
  let buttonClasses = "px-4 py-2 rounded transition-colors";
  
  // Add variant-specific classes
  if (variant === "outline") {
    buttonClasses += " border border-current hover:bg-gray-50";
  } else if (variant === "ghost") {
    buttonClasses += " hover:bg-gray-100";
  } else if (variant === "link") {
    buttonClasses += " underline";
  } else if (variant === "dark") {
    buttonClasses += " bg-gray-800 text-white hover:bg-gray-700";
  } else {
    // Default variant
    buttonClasses += " bg-indigo-600 text-white hover:bg-indigo-700";
  }
  
  // Add size-specific classes
  if (size === "sm") {
    buttonClasses += " text-sm px-3 py-1";
  } else if (size === "lg") {
    buttonClasses += " text-lg px-6 py-3";
  }
  
  // Add custom classes if provided
  if (element.props?.className) {
    buttonClasses += ` ${element.props.className}`;
  }
  
  return (
    <a href={url} className={buttonClasses}>
      {text}
    </a>
  );
};

export default ButtonElement;
