
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";

const ElementProperties = () => {
  const { elements, selectedElementId, updateElement } = useBuilder();
  const [content, setContent] = useState("");

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.content || "");
    } else {
      setContent("");
    }
  }, [selectedElement]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { content: newContent });
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4 border-t border-gray-200 mt-4">
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 mt-4">
      <h3 className="font-medium mb-2">Element Properties</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Element Type</label>
          <p className="text-sm font-medium capitalize">{selectedElement.type}</p>
        </div>
        
        <div>
          <label htmlFor="elementContent" className="text-sm text-gray-600 block mb-1">
            Content
          </label>
          <Input
            id="elementContent"
            value={content}
            onChange={handleContentChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ElementProperties;
