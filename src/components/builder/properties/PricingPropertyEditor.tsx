
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import ContentPropertyEditor from "./ContentPropertyEditor";

const PricingPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  const features = properties.features || [];
  
  const handleAddFeature = () => {
    const newFeatures = [...features, "New feature"];
    onPropertyChange("features", newFeatures);
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = features.map((feature, i) => i === index ? value : feature);
    onPropertyChange("features", newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onPropertyChange("features", newFeatures);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
            label="Plan Name"
            placeholder="Plan name..."
          />
          
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              value={properties.price || ""}
              onChange={(e) => onPropertyChange("price", e.target.value)}
              placeholder="$99"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Billing Period</Label>
            <Input
              value={properties.period || ""}
              onChange={(e) => onPropertyChange("period", e.target.value)}
              placeholder="per month"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={properties.description || ""}
              onChange={(e) => onPropertyChange("description", e.target.value)}
              placeholder="Plan description..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={properties.buttonText || "Get Started"}
              onChange={(e) => onPropertyChange("buttonText", e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured" 
              checked={properties.featured || false} 
              onCheckedChange={(checked) => onPropertyChange("featured", checked)}
            />
            <Label htmlFor="featured">Featured Plan</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Plan Features</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddFeature} 
                className="h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    className="flex-grow"
                    placeholder="Feature description"
                    value={feature}
                    onChange={(e) => handleUpdateFeature(index, e.target.value)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-1.5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingPropertyEditor;
