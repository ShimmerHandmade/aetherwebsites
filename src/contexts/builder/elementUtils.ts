
import { BuilderElement } from './types';

// Helper function to generate a unique ID for elements
export const generateElementId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Helper function to check if an element is a premium element
export const isPremiumElement = (elementType: string): boolean => {
  const premiumElements = [
    'PricingElement',
    'FeatureTableElement',
    'AnimatedHeroElement',
    'TestimonialsCarouselElement',
    'AdvancedGalleryElement',
    'TeamMembersElement',
    'StatisticsElement'
  ];
  
  return premiumElements.includes(elementType);
};

// Helper function to check if an element is an enterprise-only element
export const isEnterpriseElement = (elementType: string): boolean => {
  const enterpriseElements = [
    'CustomFormElement',
    '3DModelElement',
    'DataVisualizationElement',
    'InteractiveMapElement'
  ];
  
  return enterpriseElements.includes(elementType);
};

/**
 * Helper function to find an element by ID in the elements tree
 */
export const findElementById = (elements: BuilderElement[], id: string): BuilderElement | null => {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    
    if (element.children && element.children.length > 0) {
      const found = findElementById(element.children, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};
