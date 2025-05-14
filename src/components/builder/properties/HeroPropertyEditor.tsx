
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  // Text color options
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
  
  // Color picker component for reuse
  const ColorPicker = ({ 
    label, 
    colorProperty, 
    customColorProperty,
    onChange 
  }: { 
    label: string, 
    colorProperty: string, 
    customColorProperty: string,
    onChange: (property: string, value: any) => void 
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-between border rounded-md px-3 py-2 h-10 cursor-pointer">
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-4 h-4 rounded-full",
                  properties[colorProperty] && 
                  textColors.find(c => c.value === properties[colorProperty])?.class
                )}
                style={properties[customColorProperty] ? {
                  backgroundColor: properties[customColorProperty]
                } : {}} 
              />
              <span>
                {properties[colorProperty] === 'custom' ? 'Custom' : 
                  textColors.find(c => c.value === properties[colorProperty])?.name || 'Default'}
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
                  properties[colorProperty] === color.value && "ring-2 ring-offset-2 ring-black"
                )}
                onClick={() => {
                  onChange(colorProperty, color.value);
                  onChange(customColorProperty, undefined);
                }}
                title={color.name}
              >
                {properties[colorProperty] === color.value && (
                  <Check className={color.value === 'white' ? "h-4 w-4 text-black" : "h-4 w-4 text-white"} />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 p-2">
            <Label htmlFor={`custom-${colorProperty}`}>Custom Color</Label>
            <div className="flex items-center mt-1 gap-2">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: properties[customColorProperty] || '#000000' }} 
              />
              <Input 
                id={`custom-${colorProperty}`}
                type="color" 
                value={properties[customColorProperty] || '#000000'} 
                onChange={(e) => {
                  onChange(colorProperty, "custom");
                  onChange(customColorProperty, e.target.value);
                }}
                className="w-full h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
  
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
                value={properties.title || element.content || ""}
                onChange={(e) => {
                  onPropertyChange("title", e.target.value);
                  // Also update content for backward compatibility
                  onContentChange(e.target.value);
                }}
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
          
          {/* Text Color Controls */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="font-medium text-sm mb-3">Text Colors</h3>
            <div className="space-y-4">
              <ColorPicker
                label="Title Color"
                colorProperty="titleColor"
                customColorProperty="customTitleColor"
                onChange={onPropertyChange}
              />
              
              <ColorPicker
                label="Subtitle Color"
                colorProperty="subtitleColor"
                customColorProperty="customSubtitleColor"
                onChange={onPropertyChange}
              />
            </div>
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
