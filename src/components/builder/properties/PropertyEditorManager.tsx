
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import ContainerPropertyEditor from "./ContainerPropertyEditor";
import HeadingPropertyEditor from "./HeadingPropertyEditor";
import ImagePropertyEditor from "./ImagePropertyEditor";
import ButtonPropertyEditor from "./ButtonPropertyEditor";
import FeaturePropertyEditor from "./FeaturePropertyEditor";
import TestimonialPropertyEditor from "./TestimonialPropertyEditor";
import PricingPropertyEditor from "./PricingPropertyEditor";
import ContentPropertyEditor from "./ContentPropertyEditor";

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
  // Return the appropriate property editor based on element type
  switch (element.type) {
    case "container":
    case "section":
      return (
        <ContainerPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "heading":
      return (
        <HeadingPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "image":
      return (
        <ImagePropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "button":
      return (
        <ButtonPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "feature":
      return (
        <FeaturePropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "testimonial":
      return (
        <TestimonialPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    case "pricing":
      return (
        <PricingPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );

    // Default case - just show content editor for simple elements
    default:
      return (
        <div className="space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
        </div>
      );
  }
};

export default PropertyEditorManager;
