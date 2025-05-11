
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import PropertyEditorManager from "./properties/PropertyEditorManager";

const ElementProperties = () => {
  const { elements, selectedElementId, updateElement } = useBuilder();
  const [content, setContent] = useState("");
  const [properties, setProperties] = useState<Record<string, any>>({});

  const selectedElement = elements.find((el) => el.id === selectedElementId);

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

  if (!selectedElement) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Properties: {selectedElement.type}</h3>
      <PropertyEditorManager
        element={selectedElement}
        onPropertyChange={handlePropertyChange}
        onContentChange={handleContentChange}
      />
    </div>
  );
};

export default ElementProperties;
