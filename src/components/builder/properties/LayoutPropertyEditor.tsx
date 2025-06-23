
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuilderElement } from "@/contexts/builder/types";

interface LayoutPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
}

const LayoutPropertyEditor: React.FC<LayoutPropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="spacing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="sizing">Sizing</TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spacing" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Margin</Label>
              <Select 
                value={properties.margin || "0"}
                onValueChange={(value) => onPropertyChange("margin", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">Small</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="4">Large</SelectItem>
                  <SelectItem value="8">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Padding</Label>
              <Select 
                value={properties.padding || "0"}
                onValueChange={(value) => onPropertyChange("padding", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">Small</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="4">Large</SelectItem>
                  <SelectItem value="8">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sizing" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Width</Label>
              <Select 
                value={properties.width || "auto"}
                onValueChange={(value) => onPropertyChange("width", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="1/2">Half</SelectItem>
                  <SelectItem value="1/3">One Third</SelectItem>
                  <SelectItem value="2/3">Two Thirds</SelectItem>
                  <SelectItem value="1/4">Quarter</SelectItem>
                  <SelectItem value="3/4">Three Quarters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Height</Label>
              <Select 
                value={properties.height || "auto"}
                onValueChange={(value) => onPropertyChange("height", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="96">Large</SelectItem>
                  <SelectItem value="48">Medium</SelectItem>
                  <SelectItem value="24">Small</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Min Width</Label>
              <Input
                type="number"
                value={properties.minWidth || ""}
                onChange={(e) => onPropertyChange("minWidth", e.target.value)}
                placeholder="Auto"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Width</Label>
              <Input
                type="number"
                value={properties.maxWidth || ""}
                onChange={(e) => onPropertyChange("maxWidth", e.target.value)}
                placeholder="Auto"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="position" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Display</Label>
              <Select 
                value={properties.display || "block"}
                onValueChange={(value) => onPropertyChange("display", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="none">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Alignment</Label>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LayoutPropertyEditor;
