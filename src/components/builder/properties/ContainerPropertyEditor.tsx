
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const ContainerPropertyEditor: React.FC<PropertyEditorProps> = ({
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
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
        </TabsContent>
        
        <TabsContent value="layout" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="maxWidth" className="text-sm text-gray-600 block mb-1">
              Max Width
            </Label>
            <Select 
              value={properties.maxWidth || "1200px"}
              onValueChange={(value) => onPropertyChange("maxWidth", value)}
            >
              <SelectTrigger id="maxWidth">
                <SelectValue placeholder="Select max width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100%">Full Width</SelectItem>
                <SelectItem value="1536px">X-Large (1536px)</SelectItem>
                <SelectItem value="1200px">Large (1200px)</SelectItem>
                <SelectItem value="992px">Medium (992px)</SelectItem>
                <SelectItem value="768px">Small (768px)</SelectItem>
                <SelectItem value="640px">X-Small (640px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
                <SelectItem value="xlarge">X-Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="center" className="text-sm text-gray-600">
              Center Content
            </Label>
            <Switch
              id="center"
              checked={properties.center || false}
              onCheckedChange={(checked) => onPropertyChange("center", checked)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="background" className="text-sm text-gray-600 block mb-1">
              Background
            </Label>
            <Select 
              value={properties.background || "white"}
              onValueChange={(value) => onPropertyChange("background", value)}
            >
              <SelectTrigger id="background">
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="light">Light Gray</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
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
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customClass" className="text-sm text-gray-600 block mb-1">
              Custom Class
            </Label>
            <Input
              id="customClass"
              value={properties.customClass || ""}
              onChange={(e) => onPropertyChange("customClass", e.target.value)}
              placeholder="tailwind classes"
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContainerPropertyEditor;
