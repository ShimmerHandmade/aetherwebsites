
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { usePlan } from "@/contexts/PlanContext";
import { cn } from "@/lib/utils";

interface ElementProps {
  element: BuilderElement;
}

const PricingElement: React.FC<ElementProps> = ({ element }) => {
  // Get plan info to determine if premium animations are available
  const { isPremium, isEnterprise } = usePlan();
  const hasAnimations = isPremium || isEnterprise;
  
  // Get tier level to filter features accordingly (Basic = 1, Professional = 2, Enterprise = 3)
  const planName = element.content || "Basic Plan";
  const tierLevel = getTierLevel(planName);
  
  // Get all potential features and filter them based on tier level
  const allFeatures = element.props?.features || ["Feature 1", "Feature 2"];
  const tierFeatures = filterFeaturesByTier(allFeatures, tierLevel);

  // Add premium badge for higher tier plans
  const showPremiumBadge = tierLevel > 1;

  return (
    <div 
      className={cn(
        "p-6 border rounded-lg shadow-sm relative transition-all duration-300",
        hasAnimations && "hover:shadow-lg hover:transform hover:translate-y-[-5px]",
        tierLevel === 3 && hasAnimations && "bg-gradient-to-br from-white to-purple-50"
      )}
    >
      {showPremiumBadge && (
        <div 
          className={cn(
            "absolute top-0 right-0 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg",
            hasAnimations ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-indigo-600",
            hasAnimations && "animate-pulse"
          )}
        >
          {tierLevel === 3 ? 'Premium' : 'Pro'}
        </div>
      )}
      <div className="text-center">
        <h3 className={cn(
          "text-xl font-medium mb-2",
          hasAnimations && "animate-fade-in"
        )}>
          {planName}
        </h3>
        <div className={cn(
          "text-3xl font-bold mb-2",
          hasAnimations && "animate-fade-in"
        )}>
          {element.props?.price || "$9.99"}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {element.props?.period === 'yearly' ? 'per year' : 'per month'}
        </p>
        <ul className="mb-6 text-left space-y-2">
          {tierFeatures.map((feature: string, i: number) => (
            <li 
              key={i} 
              className={cn(
                "flex items-center",
                hasAnimations && "animate-fade-in"
              )}
              style={hasAnimations ? { animationDelay: `${i * 100}ms` } : {}}
            >
              <span className="text-green-500 mr-2">✓</span> {feature}
            </li>
          ))}
        </ul>
        <button 
          className={cn(`w-full px-4 py-2 text-white rounded transition-all`, 
            tierLevel === 3 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
              : tierLevel === 2 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-blue-600 hover:bg-blue-700',
            hasAnimations && "transform hover:scale-105"
          )}
        >
          Select Plan
        </button>
      </div>
    </div>
  );
};

// Helper function to determine tier level from plan name
function getTierLevel(planName: string): number {
  const lowerPlanName = planName.toLowerCase();
  if (lowerPlanName.includes("enterprise") || lowerPlanName.includes("premium")) return 3;
  if (lowerPlanName.includes("professional") || lowerPlanName.includes("pro")) return 2;
  return 1; // Default to Basic
}

// Helper function to filter features based on tier level
function filterFeaturesByTier(features: string[], tierLevel: number): string[] {
  // We assume features are organized with tier metadata
  return features.filter(feature => {
    // Check if feature has tier information in format "T3: Feature name"
    if (feature.match(/^T[1-3]:/)) {
      const featureTier = parseInt(feature.charAt(1));
      // Only include if feature tier is less than or equal to plan tier
      return featureTier <= tierLevel;
    }
    // If no tier prefix, include in all plans
    return true;
  }).map(feature => {
    // Remove tier prefix if present
    return feature.replace(/^T[1-3]:/, '').trim();
  });
}

export default PricingElement;
