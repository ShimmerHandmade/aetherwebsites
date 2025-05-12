
import { BuilderElement } from "./types";
import { v4 as uuidv4 } from "@/lib/uuid";

// Find an element by ID in a nested structure
export const findElementById = (
  id: string, 
  elementList: BuilderElement[]
): BuilderElement | null => {
  for (const element of elementList) {
    if (element.id === id) {
      return element;
    }
    
    if (element.children && element.children.length > 0) {
      const foundInChildren = findElementById(id, element.children);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  
  return null;
};

// Update an element in a nested structure
export const updateElementInTree = (
  elements: BuilderElement[],
  id: string,
  updateFn: (element: BuilderElement) => BuilderElement
): BuilderElement[] => {
  return elements.map(element => {
    if (element.id === id) {
      return updateFn(element);
    }
    
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementInTree(element.children, id, updateFn)
      };
    }
    
    return element;
  });
};

// Remove an element from a nested structure
export const removeElementFromTree = (
  elements: BuilderElement[],
  id: string
): BuilderElement[] => {
  return elements.filter(element => {
    if (element.id === id) {
      return false;
    }
    
    if (element.children && element.children.length > 0) {
      element.children = removeElementFromTree(element.children, id);
    }
    
    return true;
  });
};

// Clone an element and all its children with new IDs
export const cloneElement = (element: BuilderElement): BuilderElement => {
  const newElement = {
    ...element,
    id: uuidv4(),
  };
  
  if (element.children && element.children.length > 0) {
    newElement.children = element.children.map(child => cloneElement(child));
  }
  
  return newElement;
};
