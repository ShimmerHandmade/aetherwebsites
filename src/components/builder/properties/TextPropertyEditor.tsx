
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPropertyEditor from "./ContentPropertyEditor";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const textColors = [
    { name: "Default", value: "default", class: "bg-gray-800" },
    { name: "Primary", value: "primary", class: "bg-primary text-primary-foreground" },
    { name: "Secondary", value: "secondary", class: "bg-secondary text-secondary-foreground" },
    { name: "Muted", value: "muted", class: "bg-gray-500" },
    { name: "Black", value: "black", class: "bg-black" },
    { name: "White", value: "white", class: "bg-white border border-gray-200" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Custom", value: "custom", class: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" },
  ];
  
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
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-between border rounded-md px-3 py-2 h-10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-4 h-4 rounded-full",
                          element.props?.textColor && 
                          textColors.find(c => c.value === element.props.textColor)?.class
                        )}
                        style={element.props?.customTextColor ? {
                          backgroundColor: element.props.customTextColor
                        } : {}} 
                      />
                      <span>
                        {element.props?.textColor === 'custom' ? 'Custom' : 
                          textColors.find(c => c.value === element.props?.textColor)?.name || 'Default'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="start">
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {textColors.filter(color => color.value !== 'custom').map((color) => (
                      <button
                        key={color.value}
                        className={cn(
                          "w-12 h-8 rounded flex items-center justify-center",
                          color.class,
                          element.props?.textColor === color.value && "ring-2 ring-offset-2 ring-black"
                        )}
                        onClick={() => {
                          onPropertyChange("textColor", color.value);
                          onPropertyChange("customTextColor", undefined);
                        }}
                        title={color.name}
                      >
                        {element.props?.textColor === color.value && (
                          <Check className={color.value === 'white' ? "h-4 w-4 text-black" : "h-4 w-4 text-white"} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 p-2">
                    <Label htmlFor="custom-color">Custom Color</Label>
                    <div className="flex items-center mt-1 gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: element.props?.customTextColor || '#000000' }} 
                      />
                      <Input 
                        id="custom-color"
                        type="color" 
                        value={element.props?.customTextColor || '#000000'} 
                        onChange={(e) => {
                          onPropertyChange("textColor", "custom");
                          onPropertyChange("customTextColor", e.target.value);
                        }}
                        className="w-full h-8"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextPropertyEditor;
