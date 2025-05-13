
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import PropertyEditor from "./PropertyEditor";
import TextPropertyEditor from "./TextPropertyEditor";
import HeadingPropertyEditor from "./HeadingPropertyEditor";
import ImagePropertyEditor from "./ImagePropertyEditor";
import ButtonPropertyEditor from "./ButtonPropertyEditor";
import ContainerPropertyEditor from "./ContainerPropertyEditor";
import HeroPropertyEditor from "./HeroPropertyEditor";
import GridPropertyEditor from "./GridPropertyEditor";
import FlexPropertyEditor from "./FlexPropertyEditor";
import NavbarPropertyEditor from "./NavbarPropertyEditor";
import FooterPropertyEditor from "./FooterPropertyEditor";
import ListPropertyEditor from "./ListPropertyEditor";
import FormPropertyEditor from "./FormPropertyEditor";
import FeaturePropertyEditor from "./FeaturePropertyEditor";
import TestimonialPropertyEditor from "./TestimonialPropertyEditor";
import PricingPropertyEditor from "./PricingPropertyEditor";
import CardPropertyEditor from "./CardPropertyEditor";
import VideoPropertyEditor from "./VideoPropertyEditor";
import ProductsListPropertyEditor from "./ProductsListPropertyEditor";
import AnimationPropertyEditor from "./AnimationPropertyEditor";

interface PropertyEditorManagerProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (content: string) => void;
}

const PropertyEditorManager = ({
  element,
  onPropertyChange,
  onContentChange,
}: PropertyEditorManagerProps) => {
  // Return the appropriate property editor based on the element type
  switch (element.type) {
    case "text":
      return <TextPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "heading":
    case "animatedHeading":
      return <HeadingPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "image":
      return <ImagePropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "button":
      return <ButtonPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "container":
      return <ContainerPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "hero":
      return <HeroPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "grid":
      return <GridPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "flex":
      return <FlexPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "navbar":
      return <NavbarPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "footer":
      return <FooterPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "list":
      return <ListPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "form":
      return <FormPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "feature":
      return <FeaturePropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "testimonial":
      return <TestimonialPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "pricing":
      return <PricingPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "card":
      return <CardPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "video":
      return <VideoPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    case "productsList":
      return <ProductsListPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    // Animation elements
    case "fadeInElement":
    case "slideInElement":
    case "scaleInElement":
    case "particlesBackground":
    case "scrollReveal":
    case "animatedSection":
      return <AnimationPropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
    default:
      return <PropertyEditor element={element} onPropertyChange={onPropertyChange} onContentChange={onContentChange} />;
  }
};

export default PropertyEditorManager;
