
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
  if (['feature', 'testimonial', 'contact', 'pricing', 'cta', 'card', 'faq'].includes(element.type)) {
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
  return <div className="p-4">Unknown element type: {element.type}</div>;
};
