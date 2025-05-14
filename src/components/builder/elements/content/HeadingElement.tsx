
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { cn } from "@/lib/utils";

interface ElementProps {
  element: BuilderElement;
}

const HeadingElement: React.FC<ElementProps> = ({ element }) => {
  const level = element.props?.level || "h2";
  const content = element.content || "Heading";
  
  // Extract styling properties from props
  const { 
    textAlign = "left", 
    textColor = "default",
    customTextColor
  } = element.props || {};
  
  // Build the base class name based on properties
  const baseClassName = cn(
    // Text alignment classes
    {
      "text-left": textAlign === "left",
      "text-center": textAlign === "center",
      "text-right": textAlign === "right",
    },
    // Text color classes - only used if no custom color is provided
    {
      "text-gray-900": textColor === "default" && !customTextColor,
      "text-primary": textColor === "primary" && !customTextColor,
      "text-secondary": textColor === "secondary" && !customTextColor,
      "text-gray-600": textColor === "muted" && !customTextColor,
      "text-black": textColor === "black" && !customTextColor,
      "text-white": textColor === "white" && !customTextColor,
      "text-red-500": textColor === "red" && !customTextColor,
      "text-blue-500": textColor === "blue" && !customTextColor,
      "text-green-500": textColor === "green" && !customTextColor,
      "text-yellow-500": textColor === "yellow" && !customTextColor,
      "text-purple-500": textColor === "purple" && !customTextColor,
      "text-pink-500": textColor === "pink" && !customTextColor,
    },
    // Add any custom classes
    element.props?.className || ""
  );
  
  // Add specific heading level classes
  const getHeadingClassName = (baseClasses: string, headingLevel: string) => {
    switch(headingLevel) {
      case "h1": return cn(baseClasses, "text-4xl font-bold mb-4");
      case "h2": return cn(baseClasses, "text-3xl font-semibold mb-3");
      case "h3": return cn(baseClasses, "text-2xl font-semibold mb-2");
      case "h4": return cn(baseClasses, "text-xl font-medium mb-2");
      case "h5": return cn(baseClasses, "text-lg font-medium mb-1");
      case "h6": return cn(baseClasses, "text-base font-medium mb-1");
      default: return cn(baseClasses, "text-2xl font-semibold mb-3");
    }
  };
  
  const className = getHeadingClassName(baseClassName, level);
  
  // Support for custom text color
  const textStyle = customTextColor ? { color: customTextColor } : {};
  
  const renderHeading = () => {
    switch(level) {
      case "h1":
        return <h1 className={className} style={textStyle}>{content}</h1>;
      case "h3":
        return <h3 className={className} style={textStyle}>{content}</h3>;
      case "h4":
        return <h4 className={className} style={textStyle}>{content}</h4>;
      case "h5":
        return <h5 className={className} style={textStyle}>{content}</h5>;
      case "h6":
        return <h6 className={className} style={textStyle}>{content}</h6>;
      case "h2":
      default:
        return <h2 className={className} style={textStyle}>{content}</h2>;
    }
  };

  return renderHeading();
};

export default HeadingElement;
