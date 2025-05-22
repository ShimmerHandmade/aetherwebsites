
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Sparkles } from "lucide-react";

interface PremiumAnimationDemoProps {
  element: BuilderElement;
  isPreviewMode: boolean;
  isLiveSite?: boolean;
}

const PremiumAnimationDemo: React.FC<PremiumAnimationDemoProps> = ({
  element,
  isPreviewMode,
  isLiveSite = false
}) => {
  const props = element.props || {};
  const content = props.content || element.content || "Premium Animation Content";
  
  // Get animation effect
  const animationEffect = props.animationEffect || "fade-in";
  
  // Get animation class based on the effect
  let animationClass = "";
  if (isPreviewMode || isLiveSite) {
    switch (animationEffect) {
      case "fade-in":
        animationClass = "animate-fade-in";
        break;
      case "slide-in-right":
        animationClass = "animate-slide-in-right";
        break;
      case "scale-in":
        animationClass = "animate-scale-in";
        break;
      default:
        animationClass = "";
    }
  }
  
  return (
    <div className={`p-4 ${animationClass}`}>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <h3 className="text-lg font-bold">Premium Animation</h3>
        </div>
        <div className="prose prose-invert">
          <div>{content}</div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAnimationDemo;
