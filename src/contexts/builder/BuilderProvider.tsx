import React, { createContext, useState, useCallback, ReactNode, useEffect } from "react";
import { BuilderElement, PageSettings, BuilderContextType } from "./types";
import { v4 as uuidv4 } from "@/lib/uuid";
import { ensureElementsOrder } from "./pageStructureUtils";

export const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface BuilderProviderProps {
  children: ReactNode;
  initialElements?: BuilderElement[];
  initialPageSettings?: PageSettings;
  onSave?: (elements: BuilderElement[], pageSettings: PageSettings) => void;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({
  children,
  initialElements = [],
  initialPageSettings = { title: "Untitled Page" },
  onSave,
}) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(initialPageSettings);

  // Update elements when initialElements changes
  useEffect(() => {
    console.log("🔄 Updating elements from initialElements:", initialElements);
    setElements(initialElements);
  }, [initialElements]);

  // Update page settings when initialPageSettings changes
  useEffect(() => {
    console.log("🔄 Updating page settings from initialPageSettings:", initialPageSettings);
    setPageSettings(initialPageSettings);
  }, [initialPageSettings]);

  // Listen for save events
  useEffect(() => {
    const handleSaveRequest = () => {
      console.log("💾 Save request received, triggering onSave with:", { elements, pageSettings });
      if (onSave) {
        onSave(elements, pageSettings);
      }
    };

    document.addEventListener('request-save-data', handleSaveRequest);
    return () => {
      document.removeEventListener('request-save-data', handleSaveRequest);
    };
  }, [elements, pageSettings, onSave]);

  // Ensure elements are properly ordered whenever they change
  useEffect(() => {
    setElements(prevElements => {
      const orderedElements = ensureElementsOrder(prevElements);
      // Only update if the order actually changed
      if (JSON.stringify(orderedElements) !== JSON.stringify(prevElements)) {
        console.log("📋 Elements reordered for proper structure");
        return orderedElements;
      }
      return prevElements;
    });
  }, []);

  const findElementById = useCallback((id: string): BuilderElement | null => {
    const searchElements = (elementsToSearch: BuilderElement[]): BuilderElement | null => {
      for (const element of elementsToSearch) {
        if (element.id === id) {
          return element;
        }
        if (element.children) {
          const found = searchElements(element.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return searchElements(elements);
  }, [elements]);

  const findElementIndex = useCallback((id: string, parentId?: string): number => {
    if (parentId) {
      const parent = findElementById(parentId);
      if (parent?.children) {
        return parent.children.findIndex(el => el.id === id);
      }
      return -1;
    }
    return elements.findIndex(el => el.id === id);
  }, [elements, findElementById]);

  const addElement = useCallback((
    element: BuilderElement, 
    index?: number, 
    parentId?: string | null
  ) => {
    console.log("🔄 Adding element:", { element: element.type, index, parentId });
    
    setElements(prevElements => {
      let newElements = [...prevElements];
      
      if (parentId) {
        // Add to specific parent container
        const updateElementChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(el => {
            if (el.id === parentId) {
              const children = el.children || [];
              const newChildren = index !== undefined 
                ? [...children.slice(0, index), element, ...children.slice(index)]
                : [...children, element];
              
              console.log(`📋 Added element to container ${parentId}, children count: ${newChildren.length}`);
              return { ...el, children: newChildren };
            }
            
            if (el.children) {
              return { ...el, children: updateElementChildren(el.children) };
            }
            
            return el;
          });
        };
        
        newElements = updateElementChildren(newElements);
      } else {
        // Add to root level with proper ordering
        if (index !== undefined) {
          newElements.splice(index, 0, element);
        } else {
          newElements.push(element);
        }
        
        // Ensure proper element ordering (header, content, footer)
        newElements = ensureElementsOrder(newElements);
        console.log("📋 Added element to root with proper ordering");
      }
      
      return newElements;
    });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<BuilderElement>) => {
    console.log("🔄 Updating element:", { id, updates });
    setElements(prevElements => {
      const updateElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate.map(element => {
          if (element.id === id) {
            const updated = { ...element, ...updates };
            console.log("✅ Element updated:", updated);
            return updated;
          }
          if (element.children) {
            return { ...element, children: updateElementRecursively(element.children) };
          }
          return element;
        });
      };
      
      return updateElementRecursively(prevElements);
    });
  }, []);

  const removeElement = useCallback((id: string) => {
    console.log("🗑️ Removing element:", id);
    setElements(prevElements => {
      const removeElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate
          .filter(element => element.id !== id)
          .map(element => ({
            ...element,
            children: element.children ? removeElementRecursively(element.children) : undefined
          }));
      };
      
      const newElements = removeElementRecursively(prevElements);
      console.log("✅ Element removed, new count:", newElements.length);
      return newElements;
    });
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Alias for removeElement to maintain compatibility
  const deleteElement = useCallback((id: string) => {
    console.log("🗑️ Deleting element (alias):", id);
    removeElement(id);
  }, [removeElement]);

  const moveElement = useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
    console.log("🔄 Moving element:", { fromIndex, toIndex, parentId });
    setElements(prevElements => {
      if (parentId) {
        // Move within a specific parent container
        const updateElementChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(el => {
            if (el.id === parentId && el.children) {
              const children = [...el.children];
              const [movedElement] = children.splice(fromIndex, 1);
              children.splice(toIndex, 0, movedElement);
              console.log("✅ Element moved within container");
              return { ...el, children };
            }
            
            if (el.children) {
              return { ...el, children: updateElementChildren(el.children) };
            }
            
            return el;
          });
        };
        
        return updateElementChildren(prevElements);
      } else {
        // Move at root level
        const newElements = [...prevElements];
        const [movedElement] = newElements.splice(fromIndex, 1);
        newElements.splice(toIndex, 0, movedElement);
        
        // Ensure proper ordering after move
        const orderedElements = ensureElementsOrder(newElements);
        console.log("✅ Element moved at root level");
        return orderedElements;
      }
    });
  }, []);

  const moveElementUp = useCallback((id: string) => {
    console.log("⬆️ Moving element up:", id);
    const currentIndex = findElementIndex(id);
    if (currentIndex > 0) {
      moveElement(currentIndex, currentIndex - 1);
    }
  }, [findElementIndex, moveElement]);

  const moveElementDown = useCallback((id: string) => {
    console.log("⬇️ Moving element down:", id);
    const currentIndex = findElementIndex(id);
    if (currentIndex >= 0 && currentIndex < elements.length - 1) {
      moveElement(currentIndex, currentIndex + 1);
    }
  }, [findElementIndex, moveElement, elements.length]);

  const selectElement = useCallback((id: string | null) => {
    console.log("🎯 Selecting element:", id);
    setSelectedElementId(id);
  }, []);

  const duplicateElement = useCallback((id: string) => {
    console.log("📋 Duplicating element:", id);
    const element = findElementById(id);
    if (!element) {
      console.warn("❌ Element not found for duplication:", id);
      return;
    }
    
    const duplicateRecursively = (el: BuilderElement): BuilderElement => ({
      ...el,
      id: uuidv4(),
      children: el.children?.map(duplicateRecursively)
    });
    
    const duplicated = duplicateRecursively(element);
    const currentIndex = findElementIndex(id);
    
    if (currentIndex >= 0) {
      setElements(prevElements => {
        const newElements = [...prevElements];
        newElements.splice(currentIndex + 1, 0, duplicated);
        console.log("✅ Element duplicated");
        return newElements;
      });
    }
  }, [findElementById, findElementIndex]);

  const updatePageSettings = useCallback((newSettings: Partial<PageSettings>) => {
    console.log("🔄 Updating page settings:", newSettings);
    setPageSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveChanges = useCallback(() => {
    if (onSave) {
      console.log("💾 Saving changes:", { elements, pageSettings });
      onSave(elements, pageSettings);
    }
  }, [elements, pageSettings, onSave]);

  const value: BuilderContextType = {
    elements,
    selectedElementId,
    pageSettings,
    addElement,
    updateElement,
    removeElement,
    deleteElement,
    moveElement,
    moveElementUp,
    moveElementDown,
    selectElement,
    findElementById,
    duplicateElement,
    updatePageSettings,
    saveChanges,
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
