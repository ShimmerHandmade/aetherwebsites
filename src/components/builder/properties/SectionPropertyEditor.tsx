
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SectionPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="padding" className="text-sm text-gray-600 block mb-1">
              Padding
            </Label>
            <Select 
              value={properties.padding || "medium"}
              onValueChange={(value) => onPropertyChange("padding", value)}
            >
              <SelectTrigger id="padding">
                <SelectValue placeholder="Select padding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maxWidth" className="text-sm text-gray-600 block mb-1">
              Max Width
            </Label>
            <Select 
              value={properties.maxWidth || "full"}
              onValueChange={(value) => onPropertyChange("maxWidth", value)}
            >
              <SelectTrigger id="maxWidth">
                <SelectValue placeholder="Select max width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full width</SelectItem>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="backgroundColor" className="text-sm text-gray-600 block mb-1">
              Background Color
            </Label>
            <Select 
              value={properties.backgroundColor || "bg-white"}
              onValueChange={(value) => onPropertyChange("backgroundColor", value)}
            >
              <SelectTrigger id="backgroundColor">
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-white">White</SelectItem>
                <SelectItem value="bg-gray-50">Light Gray</SelectItem>
                <SelectItem value="bg-gray-100">Gray</SelectItem>
                <SelectItem value="bg-blue-50">Light Blue</SelectItem>
                <SelectItem value="bg-blue-500">Blue</SelectItem>
                <SelectItem value="bg-green-50">Light Green</SelectItem>
                <SelectItem value="bg-green-500">Green</SelectItem>
                <SelectItem value="bg-purple-50">Light Purple</SelectItem>
                <SelectItem value="bg-purple-500">Purple</SelectItem>
                <SelectItem value="bg-transparent">Transparent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionPropertyEditor;
