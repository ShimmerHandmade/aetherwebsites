
import React, { createContext, useState, useCallback, ReactNode, useEffect, useMemo } from "react";
import { BuilderElement, PageSettings, BuilderContextType, BreakpointType } from "./types";
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
  // Simplified state initialization
  const [elements, setElements] = useState<BuilderElement[]>(() => {
    const safeElements = Array.isArray(initialElements) ? initialElements : [];
    console.log("🚀 BuilderProvider: Initialized with elements:", safeElements.length);
    return safeElements;
  });
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(() => {
    const safeSettings = initialPageSettings || { title: "Untitled Page" };
    console.log("🚀 BuilderProvider: Initialized with settings:", safeSettings.title);
    return safeSettings;
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>('desktop');
  const [previewBreakpoint, setPreviewBreakpoint] = useState<BreakpointType>('desktop');

  // Simplified prop sync - only when props actually change
  useEffect(() => {
    if (Array.isArray(initialElements) && initialElements !== elements) {
      console.log("📝 BuilderProvider: Syncing elements from props");
      setElements(initialElements);
    }
  }, [initialElements]);

  useEffect(() => {
    if (initialPageSettings && initialPageSettings !== pageSettings) {
      console.log("📝 BuilderProvider: Syncing settings from props");
      setPageSettings(initialPageSettings);
    }
  }, [initialPageSettings]);

  // Simplified save handler
  useEffect(() => {
    const handleSave = () => {
      if (onSave && Array.isArray(elements) && pageSettings) {
        console.log("💾 BuilderProvider: Saving data");
        onSave(elements, pageSettings);
      }
    };

    document.addEventListener('request-save-data', handleSave);
    return () => document.removeEventListener('request-save-data', handleSave);
  }, [elements, pageSettings, onSave]);

  // Simplified element finder
  const findElementById = useCallback((id: string): BuilderElement | null => {
    if (!Array.isArray(elements)) return null;
    
    const search = (elementsToSearch: BuilderElement[]): BuilderElement | null => {
      for (const element of elementsToSearch) {
        if (element?.id === id) return element;
        if (element?.children && Array.isArray(element.children)) {
          const found = search(element.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(elements);
  }, [elements]);

  // Simplified element operations
  const addElement = useCallback((element: BuilderElement, index?: number, parentId?: string | null) => {
    const elementWithId = { ...element, id: element.id || uuidv4() };
    
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return [elementWithId];
      
      let newElements = [...prevElements];
      
      if (parentId) {
        const updateChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(el => {
            if (el.id === parentId) {
              const children = el.children || [];
              const newChildren = index !== undefined 
                ? [...children.slice(0, index), elementWithId, ...children.slice(index)]
                : [...children, elementWithId];
              return { ...el, children: newChildren };
            }
            if (el.children) {
              return { ...el, children: updateChildren(el.children) };
            }
            return el;
          });
        };
        newElements = updateChildren(newElements);
      } else {
        if (index !== undefined) {
          newElements.splice(index, 0, elementWithId);
        } else {
          newElements.push(elementWithId);
        }
        newElements = ensureElementsOrder(newElements);
      }
      
      return newElements;
    });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<BuilderElement>) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const updateRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate.map(element => {
          if (element.id === id) {
            return { ...element, ...updates };
          }
          if (element.children) {
            return { ...element, children: updateRecursively(element.children) };
          }
          return element;
        });
      };
      return updateRecursively(prevElements);
    });
  }, []);

  const updateElementResponsive = useCallback((id: string, breakpoint: BreakpointType, responsiveUpdates: any) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const updateRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate.map(element => {
          if (element.id === id) {
            return {
              ...element,
              responsiveSettings: {
                ...element.responsiveSettings,
                [breakpoint]: responsiveUpdates
              }
            };
          }
          if (element.children) {
            return { ...element, children: updateRecursively(element.children) };
          }
          return element;
        });
      };
      return updateRecursively(prevElements);
    });
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const removeRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate
          .filter(element => element.id !== id)
          .map(element => ({
            ...element,
            children: element.children ? removeRecursively(element.children) : undefined
          }));
      };
      return removeRecursively(prevElements);
    });
    
    setSelectedElementId(prev => prev === id ? null : prev);
  }, []);

  const deleteElement = useCallback((id: string) => {
    removeElement(id);
  }, [removeElement]);

  const moveElement = useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      if (parentId) {
        const updateChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(el => {
            if (el.id === parentId && el.children) {
              const children = [...el.children];
              const [movedElement] = children.splice(fromIndex, 1);
              children.splice(toIndex, 0, movedElement);
              return { ...el, children };
            }
            if (el.children) {
              return { ...el, children: updateChildren(el.children) };
            }
            return el;
          });
        };
        return updateChildren(prevElements);
      } else {
        const newElements = [...prevElements];
        const [movedElement] = newElements.splice(fromIndex, 1);
        newElements.splice(toIndex, 0, movedElement);
        return ensureElementsOrder(newElements);
      }
    });
  }, []);

  const moveElementUp = useCallback((id: string) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const currentIndex = prevElements.findIndex(el => el.id === id);
      if (currentIndex > 0) {
        const newElements = [...prevElements];
        const [movedElement] = newElements.splice(currentIndex, 1);
        newElements.splice(currentIndex - 1, 0, movedElement);
        return ensureElementsOrder(newElements);
      }
      return prevElements;
    });
  }, []);

  const moveElementDown = useCallback((id: string) => {
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const currentIndex = prevElements.findIndex(el => el.id === id);
      if (currentIndex >= 0 && currentIndex < prevElements.length - 1) {
        const newElements = [...prevElements];
        const [movedElement] = newElements.splice(currentIndex, 1);
        newElements.splice(currentIndex + 1, 0, movedElement);
        return ensureElementsOrder(newElements);
      }
      return prevElements;
    });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const duplicateElement = useCallback((id: string) => {
    const element = findElementById(id);
    if (!element) return;
    
    const duplicateRecursively = (el: BuilderElement): BuilderElement => ({
      ...el,
      id: uuidv4(),
      children: el.children?.map(duplicateRecursively)
    });
    
    const duplicated = duplicateRecursively(element);
    
    setElements(prevElements => {
      if (!Array.isArray(prevElements)) return prevElements;
      
      const currentIndex = prevElements.findIndex(el => el.id === id);
      if (currentIndex >= 0) {
        const newElements = [...prevElements];
        newElements.splice(currentIndex + 1, 0, duplicated);
        return newElements;
      }
      return prevElements;
    });
  }, [findElementById]);

  const updatePageSettings = useCallback((newSettings: Partial<PageSettings>) => {
    setPageSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveChanges = useCallback(() => {
    if (onSave) {
      onSave(elements, pageSettings);
    }
  }, [elements, pageSettings, onSave]);

  const value: BuilderContextType = {
    elements,
    selectedElementId,
    pageSettings,
    currentBreakpoint,
    previewBreakpoint,
    addElement,
    updateElement,
    updateElementResponsive,
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
    setCurrentBreakpoint,
    setPreviewBreakpoint,
  };

  console.log("✅ BuilderProvider: Rendering with", elements.length, "elements");

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
