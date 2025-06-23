
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import TextPropertyEditor from "./TextPropertyEditor";
import IconPropertyEditor from "./IconPropertyEditor";
import ListPropertyEditor from "./ListPropertyEditor";
import LayoutPropertyEditor from "./LayoutPropertyEditor";
import StylePropertyEditor from "./StylePropertyEditor";
import ResponsivePropertyEditor from "./ResponsivePropertyEditor";

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
  // Get the main property editor based on element type
  const getMainPropertyEditor = () => {
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
        return <TextPropertyEditor {...commonProps} />;
      case "icon":
        return <IconPropertyEditor {...commonProps} />;
      case "list":
        return <ListPropertyEditor {...commonProps} />;
      default:
        return (
          <ContentPropertyEditor 
            content={element.content || ""} 
            onContentChange={onContentChange}
            useMultiline={element.type === "text" || element.type === "list"}
          />
        );
    }
  };

  // Check if element supports advanced editing
  const supportsAdvancedEditing = () => {
    const advancedTypes = [
      "section", "div", "flex", "grid", "container", 
      "text", "heading", "button", "image", "card", "list"
    ];
    return advancedTypes.includes(element.type) || element.type.includes("Element");
  };

  // Simple elements get basic editor
  if (!supportsAdvancedEditing()) {
    return (
      <div className="space-y-4">
        {getMainPropertyEditor()}
      </div>
    );
  }

  // Advanced elements get tabbed interface
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="responsive">Device</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          {getMainPropertyEditor()}
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4 mt-4">
          <LayoutPropertyEditor 
            element={element}
            onPropertyChange={onPropertyChange}
          />
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 mt-4">
          <StylePropertyEditor 
            element={element}
            onPropertyChange={onPropertyChange}
          />
        </TabsContent>
        
        <TabsContent value="responsive" className="space-y-4 mt-4">
          <ResponsivePropertyEditor element={element} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyEditorManager;
