
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const TextElement: React.FC<ElementProps> = ({ element }) => {
  const textAlign = element.props?.textAlign || "left";
  const fontSize = element.props?.fontSize || "base";
  const fontWeight = element.props?.fontWeight || "normal";
  const textColor = element.props?.textColor || "default";
  
  const fontSizeClass = 
    fontSize === "xs" ? "text-xs" :
    fontSize === "sm" ? "text-sm" :
    fontSize === "base" ? "text-base" :
    fontSize === "lg" ? "text-lg" :
    fontSize === "xl" ? "text-xl" :
    fontSize === "2xl" ? "text-2xl" :
    fontSize === "3xl" ? "text-3xl" : "text-base";
    
  const fontWeightClass = 
    fontWeight === "normal" ? "font-normal" :
    fontWeight === "medium" ? "font-medium" :
    fontWeight === "semibold" ? "font-semibold" :
    fontWeight === "bold" ? "font-bold" : "font-normal";
    
  const textAlignClass = 
    textAlign === "left" ? "text-left" :
    textAlign === "center" ? "text-center" :
    textAlign === "right" ? "text-right" :
    textAlign === "justify" ? "text-justify" : "text-left";
    
  const textColorClass = 
    textColor === "primary" ? "text-blue-600" :
    textColor === "secondary" ? "text-gray-600" :
    textColor === "muted" ? "text-gray-500" : "text-slate-900";

  // Handle HTML content if it exists, otherwise use plain text
  const renderContent = () => {
    const contentToRender = element.content || "Text block. Click to edit.";
    
    // This is a simplified approach - in a real implementation, we would use a proper HTML sanitizer
    return <div dangerouslySetInnerHTML={{ __html: contentToRender }} />;
  };

  return (
    <div className="p-4">
      <div className={`${fontSizeClass} ${fontWeightClass} ${textAlignClass} ${textColorClass}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default TextElement;
