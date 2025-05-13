
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FeaturePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featureTitle" className="text-sm text-gray-600 block">
              Title
            </Label>
            <ContentPropertyEditor 
              content={element.content} 
              onContentChange={onContentChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="featureDescription" className="text-sm text-gray-600 block mb-1">
              Description
            </Label>
            <TextArea
              id="featureDescription"
              value={properties.description || ""}
              onChange={(e) => onPropertyChange("description", e.target.value)}
              placeholder="Feature description"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="featureIcon" className="text-sm text-gray-600 block mb-1">
              Icon
            </Label>
            <Input
              id="featureIcon"
              value={properties.icon || ""}
              onChange={(e) => onPropertyChange("icon", e.target.value)}
              placeholder="★"
              className="w-full"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="iconPosition" className="text-sm text-gray-600 block mb-1">
              Icon Position
            </Label>
            <Select 
              value={properties.iconPosition || "top"}
              onValueChange={(value) => onPropertyChange("iconPosition", value)}
            >
              <SelectTrigger id="iconPosition">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="none">No Icon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="iconSize" className="text-sm text-gray-600 block mb-1">
              Icon Size
            </Label>
            <Select 
              value={properties.iconSize || "medium"}
              onValueChange={(value) => onPropertyChange("iconSize", value)}
            >
              <SelectTrigger id="iconSize">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="iconColor" className="text-sm text-gray-600 block mb-1">
              Icon Color
            </Label>
            <Select 
              value={properties.iconColor || "primary"}
              onValueChange={(value) => onPropertyChange("iconColor", value)}
            >
              <SelectTrigger id="iconColor">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturePropertyEditor;
