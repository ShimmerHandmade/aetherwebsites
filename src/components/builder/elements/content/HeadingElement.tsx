
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
    textColor = "default"
  } = element.props || {};
  
  // Build the base class name based on properties
  const baseClassName = cn(
    // Text alignment classes
    {
      "text-left": textAlign === "left",
      "text-center": textAlign === "center",
      "text-right": textAlign === "right",
    },
    // Text color classes
    {
      "text-gray-900": textColor === "default",
      "text-primary": textColor === "primary",
      "text-secondary": textColor === "secondary",
      "text-gray-600": textColor === "muted",
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
  
  const renderHeading = () => {
    switch(level) {
      case "h1":
        return <h1 className={className}>{content}</h1>;
      case "h3":
        return <h3 className={className}>{content}</h3>;
      case "h4":
        return <h4 className={className}>{content}</h4>;
      case "h5":
        return <h5 className={className}>{content}</h5>;
      case "h6":
        return <h6 className={className}>{content}</h6>;
      case "h2":
      default:
        return <h2 className={className}>{content}</h2>;
    }
  };

  return renderHeading();
};

export default HeadingElement;
