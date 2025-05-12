
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const PricingElement: React.FC<ElementProps> = ({ element }) => {
  // Get tier level to filter features accordingly (Basic = 1, Professional = 2, Enterprise = 3)
  const planName = element.content || "Basic Plan";
  const tierLevel = getTierLevel(planName);
  
  // Get all potential features and filter them based on tier level
  const allFeatures = element.props?.features || ["Feature 1", "Feature 2"];
  const tierFeatures = filterFeaturesByTier(allFeatures, tierLevel);

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">{planName}</h3>
        <div className="text-3xl font-bold mb-2">{element.props?.price || "$9.99"}</div>
        <p className="text-sm text-gray-500 mb-4">{element.props?.period === 'yearly' ? 'per year' : 'per month'}</p>
        <ul className="mb-6 text-left space-y-2">
          {tierFeatures.map((feature: string, i: number) => (
            <li key={i} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> {feature}
            </li>
          ))}
        </ul>
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Select Plan</button>
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
