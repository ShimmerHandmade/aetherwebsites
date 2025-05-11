
import React from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid"; 
import { GripVertical } from "lucide-react";

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
    e.dataTransfer.effectAllowed = "copy";
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
      className="p-2 bg-gray-100 rounded cursor-move mb-2 flex items-center hover:bg-gray-200 transition-colors"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <GripVertical className="h-4 w-4 mr-2 text-gray-500" />
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
        <ElementTemplate 
          type="button" 
          label="Button" 
          content="Click Me"
          props={{ variant: "primary" }} 
        />
        <ElementTemplate 
          type="feature" 
          label="Feature Card" 
          content="Feature Title"
          props={{ description: "Feature description goes here", icon: "star" }} 
        />
        <ElementTemplate 
          type="testimonial" 
          label="Testimonial" 
          content="This is an amazing product!"
          props={{ author: "John Doe", role: "Customer" }} 
        />
        <ElementTemplate 
          type="contact" 
          label="Contact Form" 
          content="Contact Us"
        />
      </div>
    </div>
  );
};

export default ElementPalette;
