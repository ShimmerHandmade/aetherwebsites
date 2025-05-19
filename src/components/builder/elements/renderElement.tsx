
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
import { renderAnimationElement } from "./animation";

export const renderElement = (
  element: BuilderElement, 
  isPreviewMode: boolean = false,
  isLiveSite: boolean = false
): React.ReactNode => {
  try {
    // Layout Elements
    if (['header', 'hero', 'container', 'section', 'grid', 'flex', 'spacer', 'divider'].includes(element.type)) {
      return renderLayoutElement(element, isPreviewMode, isLiveSite);
    }
    
    // Content Elements
    if (['text', 'heading', 'image', 'button', 'list', 'icon'].includes(element.type)) {
      return renderContentElement(element, isPreviewMode, isLiveSite);
    }
    
    // Interactive Elements
    if (['form', 'input', 'textarea', 'checkbox', 'select'].includes(element.type)) {
      return renderInteractiveElement(element, isPreviewMode, isLiveSite);
    }
    
    // Complex Elements
    if (['feature', 'testimonial', 'contact', 'pricing', 'cta', 'card', 'faq', 'productsList'].includes(element.type)) {
      return renderComplexElement(element, isPreviewMode, isLiveSite);
    }
    
    // Media Elements
    if (['video', 'audio', 'carousel', 'gallery'].includes(element.type)) {
      return renderMediaElement(element, isPreviewMode, isLiveSite);
    }
    
    // Navigation Elements
    if (['navbar', 'menu', 'footer', 'breadcrumbs'].includes(element.type)) {
      return renderNavigationElement(element, isPreviewMode, isLiveSite);
    }
    
    // Animation Elements
    if (['fadeInElement', 'slideInElement', 'scaleInElement', 'particlesBackground', 'scrollReveal'].includes(element.type)) {
      return renderAnimationElement(element, isPreviewMode, isLiveSite);
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
