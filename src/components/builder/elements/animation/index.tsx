
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import PremiumAnimationDemo from "./PremiumAnimationDemo";

export const renderAnimationElement = (
  element: BuilderElement,
  isPreviewMode: boolean = false,
  isLiveSite: boolean = false
): React.ReactNode => {
  const props = element.props || {};
  
  // Render different animation elements based on type
  switch (element.type) {
    case 'fadeInElement':
    case 'slideInElement':
    case 'scaleInElement':
      return (
        <PremiumAnimationDemo 
          element={element}
          isPreviewMode={isPreviewMode}
          isLiveSite={isLiveSite}
        />
      );
    case 'particlesBackground':
    case 'scrollReveal':
      // Enterprise animations
      return (
        <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-2">Enterprise Animation: {element.type}</h3>
          <p>{props.content || element.content || "Enterprise animation content"}</p>
        </div>
      );
    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 bg-gray-50">
          <p>Unknown animation element: {element.type}</p>
        </div>
      );
  }
};
