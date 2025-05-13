
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import ContentPropertyEditor from "./ContentPropertyEditor";

const ButtonPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="style" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4 space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
          
          <div className="space-y-2">
            <Label htmlFor="buttonUrl" className="text-sm text-gray-600 block mb-1">
              Link URL
            </Label>
            <Input
              id="buttonUrl"
              value={properties.url || ""}
              onChange={(e) => onPropertyChange("url", e.target.value)}
              placeholder="https://example.com"
              className="w-full"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="buttonVariant" className="text-sm text-gray-600 block mb-1">
              Button Style
            </Label>
            <Select 
              value={properties.variant || "primary"}
              onValueChange={(value) => onPropertyChange("variant", value)}
            >
              <SelectTrigger id="buttonVariant">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="buttonSize" className="text-sm text-gray-600 block mb-1">
              Button Size
            </Label>
            <Select 
              value={properties.size || "default"}
              onValueChange={(value) => onPropertyChange("size", value)}
            >
              <SelectTrigger id="buttonSize">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="buttonFullWidth" className="text-sm text-gray-600">
              Full Width
            </Label>
            <Switch
              id="buttonFullWidth"
              checked={properties.fullWidth || false}
              onCheckedChange={(checked) => onPropertyChange("fullWidth", checked)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ButtonPropertyEditor;
