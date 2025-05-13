
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const GridPropertyEditor: React.FC<PropertyEditorProps> = ({
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
            <Label htmlFor="columns" className="text-sm text-gray-600 block mb-1">
              Columns
            </Label>
            <Select 
              value={String(properties.columns || "2")}
              onValueChange={(value) => onPropertyChange("columns", parseInt(value))}
            >
              <SelectTrigger id="columns">
                <SelectValue placeholder="Select columns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
                <SelectItem value="6">6 Columns</SelectItem>
                <SelectItem value="12">12 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="gap" className="text-sm text-gray-600 block mb-1">
              Gap Size
            </Label>
            <Select 
              value={properties.gap || "medium"}
              onValueChange={(value) => onPropertyChange("gap", value)}
            >
              <SelectTrigger id="gap">
                <SelectValue placeholder="Select gap size" />
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
            <Label htmlFor="autoFlow" className="text-sm text-gray-600">
              Auto-flow Row
            </Label>
            <Switch
              id="autoFlow"
              checked={properties.autoFlow === 'row'}
              onCheckedChange={(checked) => 
                onPropertyChange("autoFlow", checked ? 'row' : 'column')
              }
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="padding" className="text-sm text-gray-600 block mb-1">
              Padding
            </Label>
            <Select 
              value={properties.padding || "medium"}
              onValueChange={(value) => onPropertyChange("padding", value)}
            >
              <SelectTrigger id="padding">
                <SelectValue placeholder="Select padding size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
                <SelectItem value="transparent">Transparent</SelectItem>
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

export default GridPropertyEditor;
