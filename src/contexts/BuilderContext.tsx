
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "@/lib/uuid";

export interface BuilderElement {
  id: string;
  type: string;
  content: string;
  props?: Record<string, any>;
  children?: BuilderElement[];
}

export interface PageSettings {
  title?: string;
  description?: string;
  meta?: {
    title?: string;
    description?: string;
    indexable?: boolean;
    canonical?: string;
    ogImage?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface BuilderContextType {
  elements: BuilderElement[];
  selectedElementId: string | null;
  pageSettings: PageSettings | null;
  addElement: (element: BuilderElement, position?: number) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (sourceIndex: number, destinationIndex: number) => void;
  duplicateElement: (id: string) => void;
  loadElements: (elements: BuilderElement[]) => void;
  saveElements: () => BuilderElement[];
  updatePageSettings: (settings: Partial<PageSettings>) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ 
  children: ReactNode;
  websiteId?: string;
  initialElements?: BuilderElement[];
  initialPageSettings?: PageSettings;
  onSave?: (elements: BuilderElement[], pageSettings: PageSettings) => void;
}> = ({ children, websiteId, initialElements = [], initialPageSettings = { title: "" }, onSave }) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(initialPageSettings);

  // Load initial elements when provided
  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      setElements(initialElements);
    }
  }, [initialElements]);

  const addElement = (element: BuilderElement, position?: number) => {
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
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const removeElement = (id: string) => {
    // Check if it's a navbar or footer before removing
    const elementToRemove = elements.find(el => el.id === id);
    if (elementToRemove && (elementToRemove.type === "navbar" || elementToRemove.type === "footer")) {
      // Don't remove essential elements
      console.warn(`Cannot remove ${elementToRemove.type} element - it is required for the page structure.`);
      return;
    }
    
    setElements((prev) => prev.filter((element) => element.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const selectElement = (id: string | null) => {
    setSelectedElementId(id);
  };

  const moveElement = (sourceIndex: number, destinationIndex: number) => {
    setElements((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  };
  
  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find((element) => element.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uuidv4(),
      };
      setElements((prev) => {
        // Find the index of the element to duplicate
        const index = prev.findIndex((element) => element.id === id);
        // Insert the new element after the original
        const result = [...prev];
        result.splice(index + 1, 0, newElement);
        return result;
      });
      setSelectedElementId(newElement.id);
    }
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
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
