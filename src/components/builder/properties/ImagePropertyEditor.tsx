
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const ImagePropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="source" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="source">Source</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="source" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="imageSrc" className="text-sm text-gray-600 block mb-1">
              Image URL
            </Label>
            <Input
              id="imageSrc"
              value={properties.src || ""}
              onChange={(e) => onPropertyChange("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <Label htmlFor="imageAlt" className="text-sm text-gray-600 block mb-1">
              Alt Text
            </Label>
            <Input
              id="imageAlt"
              value={properties.alt || ""}
              onChange={(e) => onPropertyChange("alt", e.target.value)}
              placeholder="Describe the image..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="imageWidth" className="text-sm text-gray-600 block mb-1">
              Width
            </Label>
            <Select 
              value={properties.width || "auto"}
              onValueChange={(value) => onPropertyChange("width", value)}
            >
              <SelectTrigger id="imageWidth">
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="full">Full width</SelectItem>
                <SelectItem value="1/2">Half width</SelectItem>
                <SelectItem value="1/3">One third</SelectItem>
                <SelectItem value="2/3">Two thirds</SelectItem>
                <SelectItem value="1/4">Quarter width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="objectFit" className="text-sm text-gray-600 block mb-1">
              Object Fit
            </Label>
            <Select 
              value={properties.objectFit || "cover"}
              onValueChange={(value) => onPropertyChange("objectFit", value)}
            >
              <SelectTrigger id="objectFit">
                <SelectValue placeholder="Select fit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="scale-down">Scale Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="borderRadius" className="text-sm text-gray-600 block mb-1">
              Border Radius
            </Label>
            <Select 
              value={properties.borderRadius || "none"}
              onValueChange={(value) => onPropertyChange("borderRadius", value)}
            >
              <SelectTrigger id="borderRadius">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="full">Full (Circle)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="shadow" 
              checked={properties.shadow || false}
              onCheckedChange={(checked) => onPropertyChange("shadow", checked)}
            />
            <Label htmlFor="shadow" className="text-sm text-gray-600">
              Add shadow
            </Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImagePropertyEditor;
