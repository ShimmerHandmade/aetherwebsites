
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { BuilderElement, BuilderContextType, PageSettings } from "./types";
import { v4 as uuidv4 } from "@/lib/uuid";
import { 
  findElementById as findElementByIdUtil, 
  updateElementInTree, 
  removeElementFromTree,
  cloneElement
} from "./elementUtils";

export const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface BuilderProviderProps {
  children: ReactNode;
  websiteId?: string;
  initialElements?: BuilderElement[];
  initialPageSettings?: PageSettings;
  onSave?: (elements: BuilderElement[], pageSettings: PageSettings) => void;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({ 
  children, 
  websiteId, 
  initialElements = [], 
  initialPageSettings = { title: "" }, 
  onSave 
}) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(initialPageSettings);

  // Load initial elements when provided
  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      setElements(initialElements);
    }
  }, [initialElements]);

  // Helper function to find an element by ID anywhere in the tree
  const findElementById = (id: string): BuilderElement | null => {
    return findElementByIdUtil(id, elements);
  };

  const addElement = (element: BuilderElement, position?: number, parentId?: string) => {
    // If parentId is provided, add as a child of that element
    if (parentId) {
      setElements(prevElements => {
        return updateElementInTree(prevElements, parentId, parent => {
          const children = parent.children || [];
          const updatedChildren = [...children];
          
          if (position !== undefined) {
            updatedChildren.splice(position, 0, element);
          } else {
            updatedChildren.push(element);
          }
          
          return {
            ...parent,
            children: updatedChildren
          };
        });
      });
      
      setSelectedElementId(element.id);
      return;
    }
    
    // Handle top-level elements
    setElements((prev) => {
      // If this is a navbar, always add it to the beginning
      if (element.type === "navbar") {
        // Remove any existing navbars first
        const filteredElements = prev.filter(el => el.type !== "navbar");
        return [element, ...filteredElements];
      }
      
      // If this is a footer, always add it to the end
      if (element.type === "footer") {
        // Remove any existing footers first
        const filteredElements = prev.filter(el => el.type !== "footer");
        return [...filteredElements, element];
      }
      
      // For other elements, insert at the specified position or before the footer
      if (position !== undefined) {
        const newElements = [...prev];
        newElements.splice(position, 0, element);
        return newElements;
      } else {
        // Find any footers to ensure new content is added before them
        const footerIndices = prev
          .map((el, i) => el.type === "footer" ? i : -1)
          .filter(i => i !== -1);
        
        if (footerIndices.length > 0) {
          const firstFooterIndex = footerIndices[0];
          const newElements = [...prev];
          newElements.splice(firstFooterIndex, 0, element);
          return newElements;
        }
        
        // No footers, just append
        return [...prev, element];
      }
    });
    setSelectedElementId(element.id);
  };

  const updateElement = (id: string, updates: Partial<BuilderElement>) => {
    setElements(prev => 
      updateElementInTree(prev, id, element => ({ ...element, ...updates }))
    );
  };

  const removeElement = (id: string) => {
    // Check if it's a navbar or footer before removing
    const elementToRemove = findElementById(id);
    if (elementToRemove && (elementToRemove.type === "navbar" || elementToRemove.type === "footer")) {
      // Don't remove essential elements
      console.warn(`Cannot remove ${elementToRemove.type} element - it is required for the page structure.`);
      return;
    }
    
    setElements(prev => removeElementFromTree(prev, id));
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const selectElement = (id: string | null) => {
    setSelectedElementId(id);
  };

  const moveElement = (sourceIndex: number, destinationIndex: number, targetParentId?: string) => {
    // For now, only handle top-level moves
    if (!targetParentId) {
      setElements((prev) => {
        const result = Array.from(prev);
        const [removed] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);
        return result;
      });
    }
  };
  
  const duplicateElement = (id: string) => {
    const elementToDuplicate = findElementById(id);
    if (!elementToDuplicate) return;
    
    const newElement = cloneElement(elementToDuplicate);
    
    // Find the parent of the element to duplicate
    let parentId: string | undefined;
    let elementIndex = -1;
    
    // Check if element is at the root level
    const rootIndex = elements.findIndex(e => e.id === id);
    if (rootIndex !== -1) {
      elementIndex = rootIndex;
    } else {
      // Search for parent
      for (const element of elements) {
        if (element.children) {
          const childIndex = element.children.findIndex(child => child.id === id);
          if (childIndex !== -1) {
            parentId = element.id;
            elementIndex = childIndex;
            break;
          }
        }
      }
    }
    
    if (parentId) {
      addElement(newElement, elementIndex + 1, parentId);
    } else if (elementIndex !== -1) {
      addElement(newElement, elementIndex + 1);
    }
    
    setSelectedElementId(newElement.id);
  };

  const loadElements = (newElements: BuilderElement[]) => {
    // Ensure we have at least one navbar and footer
    let hasNavbar = newElements.some(el => el.type === "navbar");
    let hasFooter = newElements.some(el => el.type === "footer");
    
    const elementsToSet = [...newElements];
    
    // Add navbar if missing
    if (!hasNavbar) {
      elementsToSet.unshift({
        id: uuidv4(),
        type: "navbar",
        content: "",
        props: {
          siteName: pageSettings.title || "Your Website",
          links: [
            { text: "Home", url: "#" },
            { text: "About", url: "#" },
            { text: "Services", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "default"
        }
      });
    }
    
    // Add footer if missing
    if (!hasFooter) {
      elementsToSet.push({
        id: uuidv4(),
        type: "footer",
        content: "",
        props: {
          siteName: pageSettings.title || "Your Website",
          links: [
            { text: "Home", url: "#" },
            { text: "About", url: "#" },
            { text: "Services", url: "#" },
            { text: "Contact", url: "#" }
          ],
          variant: "dark"
        }
      });
    }
    
    setElements(elementsToSet);
    setSelectedElementId(null);
  };

  const saveElements = () => {
    if (onSave) {
      onSave(elements, pageSettings);
    }
    return elements;
  };
  
  const updatePageSettings = (settings: Partial<PageSettings>) => {
    setPageSettings(prev => ({ ...prev, ...settings }));
    
    // Update site name in navbar and footer if title changes
    if (settings.title) {
      setElements(prev => 
        prev.map(element => {
          if (element.type === "navbar" || element.type === "footer") {
            return {
              ...element,
              props: {
                ...element.props,
                siteName: settings.title
              }
            };
          }
          return element;
        })
      );
    }
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        selectedElementId,
        pageSettings,
        addElement,
        updateElement,
        removeElement,
        selectElement,
        moveElement,
        duplicateElement,
        loadElements,
        saveElements,
        updatePageSettings,
        findElementById,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
