
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const HeadingPropertyEditor: React.FC<PropertyEditorProps> = ({
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
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
          
          <div>
            <Label htmlFor="headingLevel" className="text-sm text-gray-600 block mb-1">
              Heading Level
            </Label>
            <Select 
              value={properties.level || "h2"}
              onValueChange={(value) => onPropertyChange("level", value)}
            >
              <SelectTrigger id="headingLevel">
                <SelectValue placeholder="Select heading level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="alignment" className="text-sm text-gray-600 block mb-1">
              Alignment
            </Label>
            <Select 
              value={properties.align || "left"}
              onValueChange={(value) => onPropertyChange("align", value)}
            >
              <SelectTrigger id="alignment">
                <SelectValue placeholder="Select text alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fontSize" className="text-sm text-gray-600">
                Font Size
              </Label>
              <span className="text-xs text-gray-500">
                {properties.fontSize || 100}%
              </span>
            </div>
            <Slider
              id="fontSize"
              min={50}
              max={200}
              step={5}
              defaultValue={[properties.fontSize || 100]}
              onValueChange={(value) => onPropertyChange("fontSize", value[0])}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="fontWeight" className="text-sm text-gray-600 block mb-1">
              Font Weight
            </Label>
            <Select 
              value={properties.fontWeight || "normal"}
              onValueChange={(value) => onPropertyChange("fontWeight", value)}
            >
              <SelectTrigger id="fontWeight">
                <SelectValue placeholder="Select font weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeadingPropertyEditor;
