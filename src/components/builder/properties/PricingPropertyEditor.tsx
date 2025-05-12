import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import ContentPropertyEditor from "./ContentPropertyEditor";

const PricingPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  const planName = element.content || "Basic Plan";
  const tierLevel = getTierLevel(planName);
  
  // Handle feature change with proper tier prefix
  const handleFeatureChange = (index: number, value: string) => {
    // Preserve tier prefix if it exists
    const features = [...(properties.features || [])];
    const oldFeature = features[index];
    let newFeature = value;
    
    // Keep tier prefix if it exists in the old feature
    if (oldFeature.match(/^T[1-3]:/)) {
      const tierPrefix = oldFeature.substring(0, 3); // Get "T1:" etc.
      newFeature = `${tierPrefix} ${value}`;
    }
    
    features[index] = newFeature;
    onPropertyChange("features", features);
  };
  
  // Add new feature with appropriate tier
  const addFeature = () => {
    const features = [...(properties.features || [])];
    const tierPrefix = `T${tierLevel}:`; // Use the current plan's tier
    features.push(`${tierPrefix} New Feature`);
    onPropertyChange("features", features);
  };
  
  return (
    <div className="space-y-4">
      <ContentPropertyEditor 
        content={element.content} 
        onContentChange={onContentChange} 
      />
      
      <div>
        <Label htmlFor="price" className="text-sm text-gray-600 block mb-1">
          Price
        </Label>
        <Input
          id="price"
          value={properties.price || ""}
          onChange={(e) => onPropertyChange("price", e.target.value)}
          placeholder="$9.99"
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="period" className="text-sm text-gray-600 block mb-1">
          Billing Period
        </Label>
        <Select 
          value={properties.period || "monthly"}
          onValueChange={(value) => onPropertyChange("period", value)}
        >
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Collapsible className="space-y-2">
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium text-left py-2">
          <span>Features List</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-2 border-l-2 border-gray-100 space-y-2">
          {(properties.features || ["T1: Feature 1", "T1: Feature 2"]).map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature.replace(/^T[1-3]:/, '').trim()} // Remove tier prefix for editing
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="w-full"
              />
              <button 
                type="button"
                onClick={() => {
                  const newFeatures = [...(properties.features || [])];
                  newFeatures.splice(index, 1);
                  onPropertyChange("features", newFeatures);
                }}
                className="p-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={addFeature}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Feature
          </button>
        </CollapsibleContent>
      </Collapsible>
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

export default PricingPropertyEditor;
