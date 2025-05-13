
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import PropertyEditorManager from "./properties/PropertyEditorManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ElementProperties = () => {
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    findElementById, 
    deleteElement, 
    duplicateElement, 
    moveElementUp, 
    moveElementDown 
  } = useBuilder();
  
  const [content, setContent] = useState("");
  const [properties, setProperties] = useState<Record<string, any>>({});

  // Using findElementById to get the selected element from anywhere in the tree
  const selectedElement = selectedElementId ? findElementById(selectedElementId) : null;

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.content || "");
      setProperties(selectedElement.props || {});
    } else {
      setContent("");
      setProperties({});
    }
  }, [selectedElement]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { content: newContent });
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    const updatedProps = { ...properties, [property]: value };
    setProperties(updatedProps);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { props: updatedProps });
    }
  };
  
  const handleDelete = () => {
    if (!selectedElementId) return;
    
    const elementType = selectedElement?.type || "Element";
    deleteElement(selectedElementId);
    toast({
      description: `${elementType} deleted`
    });
  };
  
  const handleDuplicate = () => {
    if (!selectedElementId) return;
    
    duplicateElement(selectedElementId);
    toast({
      description: `${selectedElement?.type || "Element"} duplicated`
    });
  };

  if (!selectedElement) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm py-8">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-medium text-gray-800">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => moveElementUp(selectedElementId)} title="Move Up">
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveElementDown(selectedElementId)} title="Move Down">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDuplicate} title="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <PropertyEditorManager
          element={selectedElement}
          onPropertyChange={handlePropertyChange}
          onContentChange={handleContentChange}
        />
      </ScrollArea>
    </div>
  );
};

export default ElementProperties;
