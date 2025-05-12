
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { 
  renderLayoutElement,
  renderContentElement,
  renderInteractiveElement,
  renderComplexElement,
  renderMediaElement,
  renderNavigationElement
} from "./index";

export const renderElement = (element: BuilderElement): React.ReactNode => {
  try {
    // Layout Elements
    if (['header', 'hero', 'container', 'section', 'grid', 'flex', 'spacer', 'divider'].includes(element.type)) {
      return renderLayoutElement(element);
    }
    
    // Content Elements
    if (['text', 'heading', 'image', 'button', 'list', 'icon'].includes(element.type)) {
      return renderContentElement(element);
    }
    
    // Interactive Elements
    if (['form', 'input', 'textarea', 'checkbox', 'select'].includes(element.type)) {
      return renderInteractiveElement(element);
    }
    
    // Complex Elements
    if (['feature', 'testimonial', 'contact', 'pricing', 'cta', 'card', 'faq', 'productsList'].includes(element.type)) {
      return renderComplexElement(element);
    }
    
    // Media Elements
    if (['video', 'audio', 'carousel', 'gallery'].includes(element.type)) {
      return renderMediaElement(element);
    }
    
    // Navigation Elements
    if (['navbar', 'menu', 'footer', 'breadcrumbs'].includes(element.type)) {
      return renderNavigationElement(element);
    }
    
    // Default case
    console.warn(`Unknown element type: ${element.type}`);
    return <div className="p-4 border border-dashed border-red-300 bg-red-50 text-red-600">Unknown element type: {element.type}</div>;
  } catch (error) {
    console.error("Error rendering element:", error);
    return (
      <div className="p-4 border border-dashed border-red-300 bg-red-50 text-red-600">
        Error rendering element: {String(error)}
      </div>
    );
  }
};
