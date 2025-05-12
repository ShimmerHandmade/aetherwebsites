
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ContentPropertyEditor from "./ContentPropertyEditor";

const HeroPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="heroTitle" className="text-sm text-gray-600 block mb-1">
                Title
              </Label>
              <Input
                id="heroTitle"
                value={element.content || ""}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="heroSubtitle" className="text-sm text-gray-600 block mb-1">
                Subtitle
              </Label>
              <Input
                id="heroSubtitle"
                value={properties.subtitle || ""}
                onChange={(e) => onPropertyChange("subtitle", e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonText" className="text-sm text-gray-600 block mb-1">
                Button Text
              </Label>
              <Input
                id="buttonText"
                value={properties.buttonText || ""}
                onChange={(e) => onPropertyChange("buttonText", e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonLink" className="text-sm text-gray-600 block mb-1">
                Button Link
              </Label>
              <Input
                id="buttonLink"
                value={properties.buttonLink || ""}
                onChange={(e) => onPropertyChange("buttonLink", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select 
                value={properties.alignment || "center"} 
                onValueChange={(value) => onPropertyChange("alignment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Background</Label>
              <Select 
                value={properties.background || "indigo-50"} 
                onValueChange={(value) => onPropertyChange("background", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indigo-50">Indigo Light</SelectItem>
                  <SelectItem value="blue-50">Blue Light</SelectItem>
                  <SelectItem value="purple-50">Purple Light</SelectItem>
                  <SelectItem value="gray-50">Gray Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Button Variant</Label>
            <Select 
              value={properties.buttonVariant || "primary"} 
              onValueChange={(value) => onPropertyChange("buttonVariant", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Button Variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Height</Label>
            <Select 
              value={properties.height || "medium"} 
              onValueChange={(value) => onPropertyChange("height", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={properties.imageUrl || ""}
              onChange={(e) => onPropertyChange("imageUrl", e.target.value)}
              placeholder="/placeholder.svg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={properties.overlay || false}
              onCheckedChange={(checked) => onPropertyChange("overlay", checked)}
              id="overlay-switch"
            />
            <Label htmlFor="overlay-switch">Enable overlay (for image backgrounds)</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeroPropertyEditor;
