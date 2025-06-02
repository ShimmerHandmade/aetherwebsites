
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

const HeroPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
            label="Hero Title"
            placeholder="Enter hero title..."
          />
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={properties.subtitle || ""}
              onChange={(e) => onPropertyChange("subtitle", e.target.value)}
              placeholder="Enter hero subtitle..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showButton" 
              checked={properties.showButton || false} 
              onCheckedChange={(checked) => onPropertyChange("showButton", checked)}
            />
            <Label htmlFor="showButton">Show CTA Button</Label>
          </div>
          
          {properties.showButton && (
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={properties.buttonText || "Get Started"}
                onChange={(e) => onPropertyChange("buttonText", e.target.value)}
              />
              <Label>Button URL</Label>
              <Input
                value={properties.buttonUrl || "#"}
                onChange={(e) => onPropertyChange("buttonUrl", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label>Height</Label>
            <Select 
              value={properties.height || "large"}
              onValueChange={(value) => onPropertyChange("height", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="full">Full Screen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Text Alignment</Label>
            <Select 
              value={properties.textAlign || "center"}
              onValueChange={(value) => onPropertyChange("textAlign", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="background" className="pt-4 space-y-4">
          <div>
            <Label>Background Type</Label>
            <Select 
              value={properties.backgroundType || "color"}
              onValueChange={(value) => onPropertyChange("backgroundType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {properties.backgroundType === "image" && (
            <div className="space-y-2">
              <Label>Background Image URL</Label>
              <Input
                value={properties.backgroundImage || ""}
                onChange={(e) => onPropertyChange("backgroundImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeroPropertyEditor;
