
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "@/lib/uuid";

export interface BuilderElement {
  id: string;
  type: string;
  content: string;
  props?: Record<string, any>;
  children?: BuilderElement[];
}

interface BuilderContextType {
  elements: BuilderElement[];
  selectedElementId: string | null;
  addElement: (element: BuilderElement) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (sourceIndex: number, destinationIndex: number) => void;
  duplicateElement: (id: string) => void;
  loadElements: (elements: BuilderElement[]) => void;
  saveElements: () => BuilderElement[];
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ 
  children: ReactNode;
  websiteId?: string;
  initialElements?: BuilderElement[];
  onSave?: (elements: BuilderElement[]) => void;
}> = ({ children, websiteId, initialElements = [], onSave }) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Load initial elements when provided
  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      setElements(initialElements);
    }
  }, [initialElements]);

  const addElement = (element: BuilderElement) => {
    setElements((prev) => [...prev, element]);
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
    setElements(newElements);
    setSelectedElementId(null);
  };

  const saveElements = () => {
    if (onSave) {
      onSave(elements);
    }
    return elements;
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        selectedElementId,
        addElement,
        updateElement,
        removeElement,
        selectElement,
        moveElement,
        duplicateElement,
        loadElements,
        saveElements,
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
