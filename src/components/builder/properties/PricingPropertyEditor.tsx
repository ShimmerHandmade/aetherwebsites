
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
          {(properties.features || ["Feature 1", "Feature 2"]).map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(properties.features || [])];
                  newFeatures[index] = e.target.value;
                  onPropertyChange("features", newFeatures);
                }}
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
            onClick={() => {
              const newFeatures = [...(properties.features || []), "New Feature"];
              onPropertyChange("features", newFeatures);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Feature
          </button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PricingPropertyEditor;
