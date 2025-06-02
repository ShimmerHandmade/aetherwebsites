
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import PropertyEditor, { PropertyEditorProps } from "./PropertyEditor";
import ContentPropertyEditor from "./ContentPropertyEditor";
import ButtonPropertyEditor from "./ButtonPropertyEditor";
import CardPropertyEditor from "./CardPropertyEditor";
import FooterPropertyEditor from "./FooterPropertyEditor";
import FlexPropertyEditor from "./FlexPropertyEditor";
import HeadingPropertyEditor from "./HeadingPropertyEditor";
import ImagePropertyEditor from "./ImagePropertyEditor";
import SectionPropertyEditor from "./SectionPropertyEditor";
import NavbarPropertyEditor from "./NavbarPropertyEditor";
import HeroPropertyEditor from "./HeroPropertyEditor";
import FeaturePropertyEditor from "./FeaturePropertyEditor";
import TestimonialPropertyEditor from "./TestimonialPropertyEditor";
import PricingPropertyEditor from "./PricingPropertyEditor";
import VideoPropertyEditor from "./VideoPropertyEditor";
import FormPropertyEditor from "./FormPropertyEditor";
import ProductsListPropertyEditor from "./ProductsListPropertyEditor";
import AnimationPropertyEditor from "./AnimationPropertyEditor";

interface PropertyEditorManagerProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const PropertyEditorManager: React.FC<PropertyEditorManagerProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  // Get the appropriate property editor based on element type
  const getPropertyEditor = () => {
    const commonProps: PropertyEditorProps = {
      element,
      onPropertyChange,
      onContentChange,
    };

    switch (element.type) {
      case "heading":
        return <HeadingPropertyEditor {...commonProps} />;
      case "button":
        return <ButtonPropertyEditor {...commonProps} />;
      case "image":
        return <ImagePropertyEditor {...commonProps} />;
      case "section":
        return <SectionPropertyEditor {...commonProps} />;
      case "card":
        return <CardPropertyEditor {...commonProps} />;
      case "footer":
        return <FooterPropertyEditor {...commonProps} />;
      case "navbar":
        return <NavbarPropertyEditor {...commonProps} />;
      case "flex":
        return <FlexPropertyEditor {...commonProps} />;
      case "hero":
        return <HeroPropertyEditor {...commonProps} />;
      case "feature":
        return <FeaturePropertyEditor {...commonProps} />;
      case "testimonial":
        return <TestimonialPropertyEditor {...commonProps} />;
      case "pricing":
        return <PricingPropertyEditor {...commonProps} />;
      case "video":
        return <VideoPropertyEditor {...commonProps} />;
      case "form":
      case "input":
      case "textarea":
      case "checkbox":
      case "select":
        return <FormPropertyEditor {...commonProps} />;
      case "productsList":
        return <ProductsListPropertyEditor {...commonProps} />;
      case "fadeInElement":
      case "slideInElement":
      case "scaleInElement":
      case "particlesBackground":
      case "scrollReveal":
        return <AnimationPropertyEditor {...commonProps} />;
      case "text":
      case "list":
      case "icon":
      default:
        // For simple elements, just show content editor
        return (
          <div className="space-y-4">
            <ContentPropertyEditor 
              content={element.content} 
              onContentChange={onContentChange}
              useMultiline={element.type === "text"}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {getPropertyEditor()}
    </div>
  );
};

export default PropertyEditorManager;
