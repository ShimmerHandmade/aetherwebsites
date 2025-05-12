
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ListPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const ListPropertyEditor: React.FC<ListPropertyEditorProps> = ({
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
            {items.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-grow"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addItem} 
              className="w-full mt-2"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>List Type</Label>
              <Select 
                value={element.props?.type || "bullet"} 
                onValueChange={(value) => onPropertyChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="List Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet List</SelectItem>
                  <SelectItem value="numbered">Numbered List</SelectItem>
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
