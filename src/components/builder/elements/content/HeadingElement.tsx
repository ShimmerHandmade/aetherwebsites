
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const HeadingElement: React.FC<ElementProps> = ({ element }) => {
  const level = element.props?.level || "h2";
  const content = element.content || "Heading";
  const className = element.props?.className || "font-bold";
  
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
