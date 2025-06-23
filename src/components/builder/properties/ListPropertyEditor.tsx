
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ListPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const items = element.props?.items || ["Item 1", "Item 2"];
  
  const addItem = () => {
    const newItems = [...items, `Item ${items.length + 1}`];
    onPropertyChange("items", newItems);
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onPropertyChange("items", newItems);
  };
  
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onPropertyChange("items", newItems);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="items">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="items">List Items</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Items</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addItem} 
                className="h-8 text-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Add Item
              </Button>
            </div>
            
            {items.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-grow"
                  placeholder={`Item ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={items.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>List Type</Label>
              <Select 
                value={element.props?.listType || "bullet"} 
                onValueChange={(value) => onPropertyChange("listType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="List Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                  <SelectItem value="numbered">Numbered List</SelectItem>
                  <SelectItem value="none">No Markers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Marker Color</Label>
              <Input
                type="color"
                value={element.props?.markerColor || "#000000"}
                onChange={(e) => onPropertyChange("markerColor", e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Item Spacing</Label>
              <Select 
                value={element.props?.itemSpacing || "normal"} 
                onValueChange={(value) => onPropertyChange("itemSpacing", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Tight</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="loose">Loose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListPropertyEditor;
