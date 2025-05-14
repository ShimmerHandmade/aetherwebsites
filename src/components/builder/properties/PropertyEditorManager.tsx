
import React from "react";
import TextPropertyEditor from "./TextPropertyEditor";
import ImagePropertyEditor from "./ImagePropertyEditor";
import HeadingPropertyEditor from "./HeadingPropertyEditor";
import ButtonPropertyEditor from "./ButtonPropertyEditor";
import ContainerPropertyEditor from "./ContainerPropertyEditor";
import FlexPropertyEditor from "./FlexPropertyEditor";
import GridPropertyEditor from "./GridPropertyEditor";
import NavbarPropertyEditor from "./NavbarPropertyEditor";
import FooterPropertyEditor from "./FooterPropertyEditor";
import HeroPropertyEditor from "./HeroPropertyEditor";
import FeaturePropertyEditor from "./FeaturePropertyEditor";
import TestimonialPropertyEditor from "./TestimonialPropertyEditor";
import PricingPropertyEditor from "./PricingPropertyEditor";
import ListPropertyEditor from "./ListPropertyEditor";
import VideoPropertyEditor from "./VideoPropertyEditor";
import CardPropertyEditor from "./CardPropertyEditor";
import FormPropertyEditor from "./FormPropertyEditor";
import ProductsListPropertyEditor from "./ProductsListPropertyEditor";
import PropertyEditor from "./PropertyEditor";
import ContentPropertyEditor from "./ContentPropertyEditor";
import ResizablePropertyEditor from "./ResizablePropertyEditor";

interface PropertyEditorManagerProps {
  element: any;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const PropertyEditorManager: React.FC<PropertyEditorManagerProps> = ({ element, onPropertyChange, onContentChange }) => {
  // If no element is selected, don't render anything
  if (!element) return null;
  
  // Check if the element is resizable
  const isResizableElement = [
    "image", "video", "container", "section", "hero", "card", 
    "feature", "gallery", "carousel", "testimonial"
  ].includes(element.type);

  return (
    <div className="space-y-6">
      {/* Content editor for elements with content */}
      {element.content !== undefined && (
        <ContentPropertyEditor
          content={element.content}
          onContentChange={onContentChange}
        />
      )}

      {/* Element-specific property editors */}
      {element.type === "text" && (
        <TextPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "heading" && (
        <HeadingPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "image" && (
        <ImagePropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "button" && (
        <ButtonPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "container" && (
        <ContainerPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "flex" && (
        <FlexPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "grid" && (
        <GridPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "navbar" && (
        <NavbarPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "footer" && (
        <FooterPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "hero" && (
        <HeroPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "feature" && (
        <FeaturePropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "testimonial" && (
        <TestimonialPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "pricing" && (
        <PricingPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "list" && (
        <ListPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "video" && (
        <VideoPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "card" && (
        <CardPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "form" && (
        <FormPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {element.type === "productsList" && (
        <ProductsListPropertyEditor 
          element={element} 
          onPropertyChange={onPropertyChange} 
          onContentChange={onContentChange}
        />
      )}
      
      {/* Show resizable editor for resizable elements */}
      {isResizableElement && (
        <ResizablePropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
        />
      )}
      
      {/* Default property editor for all element types */}
      <PropertyEditor 
        element={element} 
        onPropertyChange={onPropertyChange} 
        onContentChange={onContentChange}
      />
    </div>
  );
};

export default PropertyEditorManager;
