
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

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
            label="Heading Text"
            placeholder="Enter heading text..."
          />
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
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
                <SelectItem value="h1">H1 - Main title</SelectItem>
                <SelectItem value="h2">H2 - Section title</SelectItem>
                <SelectItem value="h3">H3 - Subsection</SelectItem>
                <SelectItem value="h4">H4 - Minor heading</SelectItem>
                <SelectItem value="h5">H5 - Small heading</SelectItem>
                <SelectItem value="h6">H6 - Smallest heading</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="textAlign" className="text-sm text-gray-600 block mb-1">
              Text Alignment
            </Label>
            <Select 
              value={properties.textAlign || "left"}
              onValueChange={(value) => onPropertyChange("textAlign", value)}
            >
              <SelectTrigger id="textAlign">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="color" className="text-sm text-gray-600 block mb-1">
              Text Color
            </Label>
            <Select 
              value={properties.color || "default"}
              onValueChange={(value) => onPropertyChange("color", value)}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeadingPropertyEditor;
