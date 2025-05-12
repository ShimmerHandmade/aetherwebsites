
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import * as LucideIcons from "lucide-react";

interface ElementProps {
  element: BuilderElement;
}

const FeatureElement: React.FC<ElementProps> = ({ element }) => {
  const title = element.props?.title || "Feature Title";
  const description = element.props?.description || "This feature provides great value to your users.";
  const iconName = element.props?.icon || "Star";
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <IconComponent className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureElement;
