
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import PropertyEditorManager from "./properties/PropertyEditorManager";
import ResponsiveControls from "./ResponsiveControls";

const ElementProperties = () => {
  const { selectedElementId, findElementById, deleteElement, updateElement } = useBuilder();

  // Get the actual selected element using the ID
  const selectedElement = selectedElementId ? findElementById(selectedElementId) : null;

  if (!selectedElement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select an element to edit its properties</p>
          <div className="mt-4">
            <ResponsiveControls />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { [property]: value });
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { content });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Properties
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="element-type" className="text-xs font-medium">
              Element Type
            </Label>
            <Input
              id="element-type"
              value={selectedElement.type}
              disabled
              className="mt-1"
            />
          </div>

          <PropertyEditorManager 
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onContentChange={handleContentChange}
          />
          
          <div className="pt-4 border-t">
            <ResponsiveControls />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementProperties;
