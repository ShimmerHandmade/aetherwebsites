
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";
import PropertyEditorManager from "./properties/PropertyEditorManager";
import ResponsiveControls from "./ResponsiveControls";

const ElementProperties = () => {
  const { 
    selectedElementId, 
    findElementById, 
    deleteElement, 
    updateElement,
    duplicateElement 
  } = useBuilder();

  // Get the actual selected element using the ID
  const selectedElement = selectedElementId ? findElementById(selectedElementId) : null;

  if (!selectedElement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            Properties
            <Badge variant="outline" className="text-xs">
              No Selection
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Eye className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Select an element to edit its properties
            </p>
            <div className="text-xs text-gray-400">
              Click on any element in the canvas to get started
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Responsive Controls</h4>
            <ResponsiveControls />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = () => {
    if (selectedElement && window.confirm('Are you sure you want to delete this element?')) {
      deleteElement(selectedElement.id);
    }
  };

  const handleDuplicate = () => {
    if (selectedElement) {
      duplicateElement(selectedElement.id);
    }
  };

  const handleToggleVisibility = () => {
    if (selectedElement) {
      const isHidden = selectedElement.props?.hidden || false;
      updateElement(selectedElement.id, { 
        props: { 
          ...selectedElement.props, 
          hidden: !isHidden 
        } 
      });
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { 
        props: { 
          ...selectedElement.props, 
          [property]: value 
        } 
      });
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { content });
    }
  };

  const isHidden = selectedElement.props?.hidden || false;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              Properties
              <Badge variant="secondary" className="text-xs capitalize">
                {selectedElement.type}
              </Badge>
              {isHidden && (
                <Badge variant="outline" className="text-xs text-orange-600">
                  Hidden
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                className="h-8 w-8 p-0"
                title={isHidden ? "Show element" : "Hide element"}
              >
                {isHidden ? (
                  <EyeOff className="h-4 w-4 text-orange-600" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDuplicate}
                className="h-8 w-8 p-0"
                title="Duplicate element"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete element"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="element-id" className="text-xs font-medium text-gray-500">
                Element ID
              </Label>
              <Input
                id="element-id"
                value={selectedElement.id}
                disabled
                className="mt-1 text-xs font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="element-type" className="text-xs font-medium text-gray-500">
                Element Type
              </Label>
              <Input
                id="element-type"
                value={selectedElement.type}
                disabled
                className="mt-1 capitalize"
              />
            </div>
          </div>

          <Separator />

          <PropertyEditorManager 
            element={selectedElement}
            onPropertyChange={handlePropertyChange}
            onContentChange={handleContentChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementProperties;
