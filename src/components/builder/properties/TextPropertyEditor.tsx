
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

const TextPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <ContentPropertyEditor 
            content={element.content || ""} 
            onContentChange={onContentChange} 
            useMultiline={true}
            label="Text Content"
            placeholder="Enter your text here..."
          />
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select 
                value={properties.fontSize || "base"}
                onValueChange={(value) => onPropertyChange("fontSize", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Extra Small</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="2xl">2X Large</SelectItem>
                  <SelectItem value="3xl">3X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select 
                value={properties.fontWeight || "normal"}
                onValueChange={(value) => onPropertyChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semi Bold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select 
                value={properties.textAlign || "left"}
                onValueChange={(value) => onPropertyChange("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={properties.color || "#000000"}
                onChange={(e) => onPropertyChange("color", e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Line Height: {properties.lineHeight || 1.5}</Label>
              <Slider
                value={[properties.lineHeight || 1.5]}
                onValueChange={(value) => onPropertyChange("lineHeight", value[0])}
                max={3}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextPropertyEditor;
