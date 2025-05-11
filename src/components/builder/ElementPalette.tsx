
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { v4 as uuidv4 } from "@/lib/uuid"; 
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ElementTemplateProps {
  type: string;
  label: string;
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
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-left">
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

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
    <div className="overflow-y-auto h-full">
      <h2 className="font-medium mb-4">Elements</h2>
      
      <ElementCategory title="Layout Elements">
        <ElementTemplate type="header" label="Header" content="Website Header" />
        <ElementTemplate type="hero" label="Hero Section" content="Welcome to My Website" />
        <ElementTemplate type="container" label="Container" content="" props={{ padding: "medium", background: "white" }} />
        <ElementTemplate type="section" label="Page Section" content="Section" props={{ padding: "large", background: "gray" }} />
        <ElementTemplate type="grid" label="Grid Layout" props={{ columns: 2, gap: "medium" }} />
        <ElementTemplate type="flex" label="Flex Container" props={{ direction: "row", justify: "center", align: "center" }} />
        <ElementTemplate type="spacer" label="Spacer" props={{ height: "medium" }} />
        <ElementTemplate type="divider" label="Divider" props={{ color: "gray" }} />
      </ElementCategory>
      
      <ElementCategory title="Content Elements">
        <ElementTemplate type="text" label="Text Block" content="Add your content here" />
        <ElementTemplate
          type="heading"
          label="Heading"
          content="Heading"
          props={{ level: "h2" }}
        />
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
          type="list"
          label="List"
          props={{ items: ["Item 1", "Item 2", "Item 3"], type: "bullet" }}
        />
        <ElementTemplate
          type="icon"
          label="Icon"
          props={{ name: "star", size: "medium", color: "indigo" }}
        />
      </ElementCategory>
      
      <ElementCategory title="Interactive Elements">
        <ElementTemplate 
          type="form" 
          label="Form" 
          content="Contact Form"
          props={{ fields: ["name", "email", "message"] }}
        />
        <ElementTemplate 
          type="input" 
          label="Input Field" 
          props={{ type: "text", placeholder: "Enter text..." }} 
        />
        <ElementTemplate 
          type="textarea" 
          label="Text Area" 
          props={{ placeholder: "Enter your message...", rows: 4 }} 
        />
        <ElementTemplate 
          type="checkbox" 
          label="Checkbox" 
          content="I agree to terms"
        />
        <ElementTemplate 
          type="select" 
          label="Select Dropdown" 
          props={{ options: ["Option 1", "Option 2", "Option 3"] }} 
        />
      </ElementCategory>
      
      <ElementCategory title="Complex Elements">
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
        <ElementTemplate 
          type="pricing" 
          label="Pricing Card" 
          content="Basic Plan"
          props={{ price: "$9.99", period: "monthly", features: ["Feature 1", "Feature 2"] }}
        />
        <ElementTemplate 
          type="cta" 
          label="Call to Action" 
          content="Get Started Today"
          props={{ buttonText: "Sign Up", buttonVariant: "primary" }}
        />
        <ElementTemplate 
          type="card" 
          label="Card" 
          content="Card Title"
          props={{ description: "Card content goes here" }}
        />
        <ElementTemplate 
          type="faq" 
          label="FAQ Item" 
          content="Frequently Asked Question"
          props={{ answer: "The answer to the question goes here." }}
        />
      </ElementCategory>
      
      <ElementCategory title="Media Elements">
        <ElementTemplate 
          type="video" 
          label="Video" 
          props={{ src: "", poster: "", autoplay: false }}
        />
        <ElementTemplate 
          type="audio" 
          label="Audio Player" 
          props={{ src: "", controls: true }}
        />
        <ElementTemplate 
          type="carousel" 
          label="Image Carousel" 
          props={{ images: [{ src: "", alt: "Slide 1" }, { src: "", alt: "Slide 2" }] }}
        />
        <ElementTemplate 
          type="gallery" 
          label="Image Gallery" 
          props={{ images: [{ src: "", alt: "Image 1" }, { src: "", alt: "Image 2" }] }}
        />
      </ElementCategory>
      
      <ElementCategory title="Navigation Elements">
        <ElementTemplate 
          type="navbar" 
          label="Navigation Bar" 
          props={{ links: [{ text: "Home", url: "#" }, { text: "About", url: "#" }] }}
        />
        <ElementTemplate 
          type="menu" 
          label="Menu" 
          props={{ items: [{ text: "Item 1", url: "#" }, { text: "Item 2", url: "#" }] }}
        />
        <ElementTemplate 
          type="footer" 
          label="Footer" 
          content="Website Footer"
        />
        <ElementTemplate 
          type="breadcrumbs" 
          label="Breadcrumbs" 
          props={{ items: [{ text: "Home", url: "#" }, { text: "Section", url: "#" }] }}
        />
      </ElementCategory>
    </div>
  );
};

export default ElementPalette;
