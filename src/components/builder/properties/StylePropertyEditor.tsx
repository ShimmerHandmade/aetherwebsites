
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuilderElement } from "@/contexts/builder/types";

interface StylePropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
}

const StylePropertyEditor: React.FC<StylePropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="border">Border</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={properties.backgroundColor || "#ffffff"}
                onChange={(e) => onPropertyChange("backgroundColor", e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Background Image</Label>
              <Input
                type="url"
                value={properties.backgroundImage || ""}
                onChange={(e) => onPropertyChange("backgroundImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {properties.backgroundImage && (
              <div className="space-y-2">
                <Label>Background Size</Label>
                <Select 
                  value={properties.backgroundSize || "cover"}
                  onValueChange={(value) => onPropertyChange("backgroundSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="100% 100%">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="border" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Border Width</Label>
              <Select 
                value={String(properties.borderWidth || 0)}
                onValueChange={(value) => onPropertyChange("borderWidth", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">Thin (1px)</SelectItem>
                  <SelectItem value="2">Medium (2px)</SelectItem>
                  <SelectItem value="4">Thick (4px)</SelectItem>
                  <SelectItem value="8">Very Thick (8px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {properties.borderWidth > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <Input
                    type="color"
                    value={properties.borderColor || "#000000"}
                    onChange={(e) => onPropertyChange("borderColor", e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Border Style</Label>
                  <Select 
                    value={properties.borderStyle || "solid"}
                    onValueChange={(value) => onPropertyChange("borderStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select 
                value={properties.borderRadius || "0"}
                onValueChange={(value) => onPropertyChange("borderRadius", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="full">Full (Circle)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Shadow</Label>
              <Select 
                value={properties.boxShadow || "none"}
                onValueChange={(value) => onPropertyChange("boxShadow", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Opacity (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={Math.round((properties.opacity || 1) * 100)}
                onChange={(e) => onPropertyChange("opacity", Number(e.target.value) / 100)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StylePropertyEditor;
