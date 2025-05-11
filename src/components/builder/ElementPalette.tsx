
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid"; // We'll implement this simple UUID function

interface ElementTemplateProps {
  type: string;
  label: string;
  content?: string;
  props?: Record<string, any>;
}

const ElementTemplate: React.FC<ElementTemplateProps> = ({ type, label, content, props }) => {
  const { addElement } = useBuilder();

  const handleDragStart = (e: React.DragEvent) => {
    const elementData = { type, content: content || label, props };
    e.dataTransfer.setData("application/json", JSON.stringify(elementData));
  };

  const handleClick = () => {
    addElement({
      id: uuidv4(),
      type,
      content: content || label,
      props,
    });
  };

  return (
    <div
      className="p-2 bg-gray-100 rounded cursor-move mb-2"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

const ElementPalette = () => {
  return (
    <div>
      <h2 className="font-medium mb-4">Elements</h2>
      <div className="space-y-2">
        <ElementTemplate type="header" label="Header" content="Website Header" />
        <ElementTemplate type="hero" label="Hero Section" content="Welcome to My Website" />
        <ElementTemplate type="text" label="Text Block" content="Add your content here" />
        <ElementTemplate
          type="image"
          label="Image"
          props={{ src: "", alt: "Image description" }}
        />
      </div>
    </div>
  );
};

export default ElementPalette;
