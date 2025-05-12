
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import ContainerPropertyEditor from "./ContainerPropertyEditor";
import HeadingPropertyEditor from "./HeadingPropertyEditor";
import ImagePropertyEditor from "./ImagePropertyEditor";
import VideoPropertyEditor from "./VideoPropertyEditor";
import ButtonPropertyEditor from "./ButtonPropertyEditor";
import FeaturePropertyEditor from "./FeaturePropertyEditor";
import TestimonialPropertyEditor from "./TestimonialPropertyEditor";
import PricingPropertyEditor from "./PricingPropertyEditor";
import ContentPropertyEditor from "./ContentPropertyEditor";
import TextPropertyEditor from "./TextPropertyEditor";
import FormPropertyEditor from "./FormPropertyEditor";
import ListPropertyEditor from "./ListPropertyEditor";
import CardPropertyEditor from "./CardPropertyEditor";

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

    case "text":
      return (
        <TextPropertyEditor
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

    case "video":
      return (
        <VideoPropertyEditor
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
      
    case "list":
      return (
        <ListPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );
      
    case "form":
      return (
        <FormPropertyEditor
          element={element}
          onPropertyChange={onPropertyChange}
          onContentChange={onContentChange}
        />
      );
      
    case "card":
      return (
        <CardPropertyEditor
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
      
    case "navbar":
    case "footer":
      return (
        <div className="space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input
              value={element.props?.siteName || "Your Website"}
              onChange={(e) => onPropertyChange("siteName", e.target.value)}
            />
          </div>
          {element.type === "navbar" && (
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={element.props?.logo || ""}
                onChange={(e) => onPropertyChange("logo", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          )}
        </div>
      );

    // Default case - just show content editor for simple elements
    default:
      return (
        <div className="space-y-4">
          <ContentPropertyEditor 
            content={element.content} 
            onContentChange={onContentChange} 
          />
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2 text-gray-600">Properties</h4>
            <p className="text-xs text-gray-500">
              No specific property editor for this element type yet.
              Basic content editing is available.
            </p>
          </div>
        </div>
      );
  }
};

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default PropertyEditorManager;
