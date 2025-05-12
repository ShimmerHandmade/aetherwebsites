
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ElementTemplateProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  content?: string;
  props?: Record<string, any>;
}

const ElementCategory: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded text-left">
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="grid grid-cols-2 gap-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Helper function to create element icons
const getElementIcon = (type: string): React.ReactNode => {
  // Simple SVG icons for each element type
  switch (type) {
    case "header":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="3" width="18" height="6" rx="1" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      );
    case "hero":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="3" width="18" height="12" rx="1" />
          <rect x="7" y="8" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      );
    case "text":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <line x1="6" y1="5" x2="18" y2="5" />
          <line x1="6" y1="9" x2="18" y2="9" />
          <line x1="6" y1="13" x2="14" y2="13" />
        </svg>
      );
    case "heading":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <line x1="3" y1="5" x2="21" y2="5" strokeWidth="3" />
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      );
    case "image":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "button":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="8" width="18" height="8" rx="2" />
        </svg>
      );
    case "form":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="7" y1="9" x2="17" y2="9" />
          <line x1="7" y1="13" x2="17" y2="13" />
          <line x1="7" y1="17" x2="12" y2="17" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
  }
};

const ElementTemplate: React.FC<ElementTemplateProps> = ({ type, label, content, icon, props }) => {
  const { addElement } = useBuilder();

  const handleDragStart = (e: React.DragEvent) => {
    const elementData = { type, content: content || label, props };
    
    // Fix: Properly set the MIME type and stringify the data
    e.dataTransfer.setData("application/json", JSON.stringify(elementData));
    e.dataTransfer.effectAllowed = "copy";
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.classList.add("opacity-50");
    
    // Set a drag image if needed
    if (target.firstElementChild) {
      e.dataTransfer.setDragImage(target.firstElementChild, 15, 15);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove("opacity-50");
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
      className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors text-center"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <div className="w-8 h-8 mb-1 text-gray-500">
        {icon || getElementIcon(type)}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

const ElementPalette = () => {
  return (
    <div className="overflow-y-auto h-full">
      <h2 className="font-medium mb-4 text-sm">Elements</h2>
      
      <ElementCategory title="Layout Elements">
        <ElementTemplate 
          type="header" 
          label="Header" 
          content="Website Header" 
          icon={getElementIcon("header")} 
        />
        <ElementTemplate 
          type="hero" 
          label="Hero" 
          content="Welcome to My Website" 
          icon={getElementIcon("hero")} 
        />
        <ElementTemplate 
          type="container" 
          label="Container" 
          content="" 
          props={{ padding: "medium", background: "white" }} 
          icon={getElementIcon("container")} 
        />
        <ElementTemplate 
          type="section" 
          label="Section" 
          content="Section" 
          props={{ padding: "large", background: "gray" }} 
          icon={getElementIcon("section")} 
        />
        <ElementTemplate 
          type="grid" 
          label="Grid" 
          props={{ columns: 2, gap: "medium" }} 
          icon={getElementIcon("grid")} 
        />
        <ElementTemplate 
          type="spacer" 
          label="Spacer" 
          props={{ height: "medium" }} 
          icon={getElementIcon("spacer")} 
        />
      </ElementCategory>
      
      <ElementCategory title="Content Elements">
        <ElementTemplate 
          type="text" 
          label="Text" 
          content="Add your content here" 
          icon={getElementIcon("text")} 
        />
        <ElementTemplate
          type="heading"
          label="Heading"
          content="Heading"
          props={{ level: "h2" }}
          icon={getElementIcon("heading")}
        />
        <ElementTemplate
          type="image"
          label="Image"
          props={{ src: "", alt: "Image description" }}
          icon={getElementIcon("image")}
        />
        <ElementTemplate 
          type="button" 
          label="Button" 
          content="Click Me"
          props={{ variant: "primary" }} 
          icon={getElementIcon("button")}
        />
        <ElementTemplate
          type="list"
          label="List"
          props={{ items: ["Item 1", "Item 2", "Item 3"], type: "bullet" }}
          icon={getElementIcon("list")}
        />
      </ElementCategory>
      
      <ElementCategory title="Interactive Elements">
        <ElementTemplate 
          type="form" 
          label="Form" 
          content="Contact Form"
          props={{ fields: ["name", "email", "message"] }}
          icon={getElementIcon("form")}
        />
        <ElementTemplate 
          type="input" 
          label="Input" 
          props={{ type: "text", placeholder: "Enter text..." }} 
          icon={getElementIcon("input")}
        />
        <ElementTemplate 
          type="textarea" 
          label="Textarea" 
          props={{ placeholder: "Enter your message...", rows: 4 }} 
          icon={getElementIcon("textarea")}
        />
        <ElementTemplate 
          type="checkbox" 
          label="Checkbox" 
          content="I agree to terms"
          icon={getElementIcon("checkbox")}
        />
      </ElementCategory>
      
      <ElementCategory title="Complex Elements">
        <ElementTemplate 
          type="feature" 
          label="Feature" 
          content="Feature Title"
          props={{ description: "Feature description goes here", icon: "star" }} 
          icon={getElementIcon("feature")}
        />
        <ElementTemplate 
          type="testimonial" 
          label="Testimonial" 
          content="This is an amazing product!"
          props={{ author: "John Doe", role: "Customer" }} 
          icon={getElementIcon("testimonial")}
        />
        <ElementTemplate 
          type="card" 
          label="Card" 
          content="Card Title"
          props={{ description: "Card content goes here" }}
          icon={getElementIcon("card")}
        />
        <ElementTemplate 
          type="pricing" 
          label="Pricing" 
          content="Basic Plan"
          props={{ price: "$9.99", period: "monthly", features: ["Feature 1", "Feature 2"] }}
          icon={getElementIcon("pricing")}
        />
      </ElementCategory>
    </div>
  );
};

export default ElementPalette;
