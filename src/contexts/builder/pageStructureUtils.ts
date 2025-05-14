
import { BuilderElement } from "./types";

/**
 * Checks if the page has the required structural elements
 */
export const hasRequiredStructure = (elements: BuilderElement[]): {
  hasHeader: boolean;
  hasFooter: boolean;
} => {
  // Check for navbar/header at the top
  const hasHeader = elements.some(el => el.type === 'navbar' || el.type === 'header');
  
  // Check for footer at the bottom
  const hasFooter = elements.some(el => el.type === 'footer');
  
  return { hasHeader, hasFooter };
};

/**
 * Gets the appropriate insertion index for elements based on page structure
 * This ensures elements are added between header and footer
 */
export const getContentInsertionIndex = (elements: BuilderElement[]): number => {
  // Find the index of the navbar/header (if any)
  const headerIndex = elements.findIndex(el => el.type === 'navbar' || el.type === 'header');
  
  // Find the index of the footer (if any)
  const footerIndex = elements.findIndex(el => el.type === 'footer');
  
  // If we have both header and footer
  if (headerIndex !== -1 && footerIndex !== -1) {
    // Insert after header
    return headerIndex + 1;
  }
  
  // If we only have a header, insert after it
  if (headerIndex !== -1) {
    return headerIndex + 1;
  }
  
  // If we only have a footer, insert before it
  if (footerIndex !== -1) {
    return footerIndex;
  }
  
  // If we have neither, insert at the end
  return elements.length;
};

/**
 * Ensures proper ordering of elements with header at top and footer at bottom
 */
export const ensureElementsOrder = (elements: BuilderElement[]): BuilderElement[] => {
  // Extract the elements by type
  const navbarElements = elements.filter(el => el.type === 'navbar' || el.type === 'header');
  const footerElements = elements.filter(el => el.type === 'footer');
  const contentElements = elements.filter(el => 
    el.type !== 'navbar' && el.type !== 'header' && el.type !== 'footer');
  
  // Always ensure only one navbar and one footer
  const navbar = navbarElements.length > 0 ? navbarElements[0] : null;
  const footer = footerElements.length > 0 ? footerElements[0] : null;
  
  // Rebuild the elements array with the correct order
  const orderedElements: BuilderElement[] = [];
  
  // Add navbar first if it exists
  if (navbar) {
    orderedElements.push(navbar);
  }
  
  // Add all content elements in the middle
  orderedElements.push(...contentElements);
  
  // Add footer last if it exists
  if (footer) {
    orderedElements.push(footer);
  }
  
  return orderedElements;
};
