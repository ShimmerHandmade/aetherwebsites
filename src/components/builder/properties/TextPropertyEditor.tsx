
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";

interface TextPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const TextPropertyEditor: React.FC<TextPropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const fontSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];
  const fontWeights = ["normal", "medium", "semibold", "bold"];
  const textAligns = ["left", "center", "right", "justify"];
  const textColors = ["default", "primary", "secondary", "muted"];
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange}
            useRichEditor={true}
          />
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select 
                value={element.props?.fontSize || "base"} 
                onValueChange={(value) => onPropertyChange("fontSize", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Font Size" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select 
                value={element.props?.fontWeight || "normal"} 
                onValueChange={(value) => onPropertyChange("fontWeight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  {fontWeights.map((weight) => (
                    <SelectItem key={weight} value={weight}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Text Align</Label>
              <Select 
                value={element.props?.textAlign || "left"} 
                onValueChange={(value) => onPropertyChange("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Text Align" />
                </SelectTrigger>
                <SelectContent>
                  {textAligns.map((align) => (
                    <SelectItem key={align} value={align}>
                      {align}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Select 
                value={element.props?.textColor || "default"} 
                onValueChange={(value) => onPropertyChange("textColor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Text Color" />
                </SelectTrigger>
                <SelectContent>
                  {textColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextPropertyEditor;
