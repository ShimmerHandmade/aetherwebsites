
import React, { createContext, useState, useCallback, ReactNode, useEffect } from "react";
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
  const [elements, setElements] = useState<BuilderElement[]>(() => {
    console.log("🔄 BuilderProvider: Initializing elements:", initialElements);
    return Array.isArray(initialElements) ? initialElements : [];
  });
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(() => {
    console.log("🔄 BuilderProvider: Initializing pageSettings:", initialPageSettings);
    return initialPageSettings || { title: "Untitled Page" };
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>('desktop');
  const [previewBreakpoint, setPreviewBreakpoint] = useState<BreakpointType>('desktop');

  console.log("🔄 BuilderProvider: Rendering with", {
    elementsCount: elements?.length || 0,
    selectedElementId,
    pageSettings: pageSettings?.title
  });

  // Simplified initialization - only update when props actually change
  useEffect(() => {
    if (Array.isArray(initialElements) && initialElements.length !== elements.length) {
      console.log("🔄 BuilderProvider: Updating elements from props:", initialElements.length);
      setElements(initialElements);
    }
  }, [initialElements]);

  useEffect(() => {
    if (initialPageSettings && initialPageSettings.title !== pageSettings.title) {
      console.log("🔄 BuilderProvider: Updating pageSettings from props:", initialPageSettings);
      setPageSettings(initialPageSettings);
    }
  }, [initialPageSettings]);

  // Simple save event listener
  useEffect(() => {
    const handleSaveRequest = () => {
      console.log("💾 BuilderProvider: Save request received");
      if (onSave && elements && pageSettings) {
        onSave(elements, pageSettings);
      }
    };

    document.addEventListener('request-save-data', handleSaveRequest);
    return () => document.removeEventListener('request-save-data', handleSaveRequest);
  }, [elements, pageSettings, onSave]);

  const findElementById = useCallback((id: string): BuilderElement | null => {
    const searchElements = (elementsToSearch: BuilderElement[]): BuilderElement | null => {
      for (const element of elementsToSearch) {
        if (element.id === id) return element;
        if (element.children) {
          const found = searchElements(element.children);
          if (found) return found;
        }
      }
      return null;
    };
    return searchElements(elements);
  }, [elements]);

  const value: BuilderContextType = {
    elements,
    selectedElementId,
    pageSettings,
    currentBreakpoint,
    previewBreakpoint,
    addElement: useCallback((element: BuilderElement, index?: number, parentId?: string | null) => {
      console.log("➕ BuilderProvider: Adding element", { element: element.type, index, parentId });
      
      const elementWithId = { ...element, id: element.id || uuidv4() };
      
      setElements(prevElements => {
        let newElements = [...prevElements];
        
        if (parentId) {
          const updateElementChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
            return elementsToUpdate.map(el => {
              if (el.id === parentId) {
                const children = el.children || [];
                const newChildren = index !== undefined 
                  ? [...children.slice(0, index), elementWithId, ...children.slice(index)]
                  : [...children, elementWithId];
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
          if (index !== undefined) {
            newElements.splice(index, 0, elementWithId);
          } else {
            newElements.push(elementWithId);
          }
          newElements = ensureElementsOrder(newElements);
        }
        
        return newElements;
      });
    }, []),

    updateElement: useCallback((id: string, updates: Partial<BuilderElement>) => {
      setElements(prevElements => {
        const updateElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(element => {
            if (element.id === id) {
              return { ...element, ...updates };
            }
            if (element.children) {
              return { ...element, children: updateElementRecursively(element.children) };
            }
            return element;
          });
        };
        return updateElementRecursively(prevElements);
      });
    }, []),

    updateElementResponsive: useCallback((id: string, breakpoint: BreakpointType, responsiveUpdates: any) => {
      setElements(prevElements => {
        const updateElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
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
              return { ...element, children: updateElementRecursively(element.children) };
            }
            return element;
          });
        };
        return updateElementRecursively(prevElements);
      });
    }, []),

    removeElement: useCallback((id: string) => {
      setElements(prevElements => {
        const removeElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate
            .filter(element => element.id !== id)
            .map(element => ({
              ...element,
              children: element.children ? removeElementRecursively(element.children) : undefined
            }));
        };
        return removeElementRecursively(prevElements);
      });
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    }, [selectedElementId]),

    deleteElement: useCallback((id: string) => {
      setElements(prevElements => {
        const removeElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate
            .filter(element => element.id !== id)
            .map(element => ({
              ...element,
              children: element.children ? removeElementRecursively(element.children) : undefined
            }));
        };
        return removeElementRecursively(prevElements);
      });
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    }, [selectedElementId]),

    moveElement: useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
      setElements(prevElements => {
        if (parentId) {
          const updateElementChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
            return elementsToUpdate.map(el => {
              if (el.id === parentId && el.children) {
                const children = [...el.children];
                const [movedElement] = children.splice(fromIndex, 1);
                children.splice(toIndex, 0, movedElement);
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
          const newElements = [...prevElements];
          const [movedElement] = newElements.splice(fromIndex, 1);
          newElements.splice(toIndex, 0, movedElement);
          return ensureElementsOrder(newElements);
        }
      });
    }, []),

    moveElementUp: useCallback((id: string) => {
      const currentIndex = elements.findIndex(el => el.id === id);
      if (currentIndex > 0) {
        setElements(prevElements => {
          const newElements = [...prevElements];
          const [movedElement] = newElements.splice(currentIndex, 1);
          newElements.splice(currentIndex - 1, 0, movedElement);
          return ensureElementsOrder(newElements);
        });
      }
    }, [elements]),

    moveElementDown: useCallback((id: string) => {
      const currentIndex = elements.findIndex(el => el.id === id);
      if (currentIndex >= 0 && currentIndex < elements.length - 1) {
        setElements(prevElements => {
          const newElements = [...prevElements];
          const [movedElement] = newElements.splice(currentIndex, 1);
          newElements.splice(currentIndex + 1, 0, movedElement);
          return ensureElementsOrder(newElements);
        });
      }
    }, [elements]),

    selectElement: useCallback((id: string | null) => {
      console.log("🎯 BuilderProvider: Selecting element:", id);
      setSelectedElementId(id);
    }, []),

    findElementById,

    duplicateElement: useCallback((id: string) => {
      const element = findElementById(id);
      if (!element) return;
      
      const duplicateRecursively = (el: BuilderElement): BuilderElement => ({
        ...el,
        id: uuidv4(),
        children: el.children?.map(duplicateRecursively)
      });
      
      const duplicated = duplicateRecursively(element);
      const currentIndex = elements.findIndex(el => el.id === id);
      
      if (currentIndex >= 0) {
        setElements(prevElements => {
          const newElements = [...prevElements];
          newElements.splice(currentIndex + 1, 0, duplicated);
          return newElements;
        });
      }
    }, [elements, findElementById]),

    updatePageSettings: useCallback((newSettings: Partial<PageSettings>) => {
      console.log("📄 BuilderProvider: Updating page settings:", newSettings);
      setPageSettings(prev => ({ ...prev, ...newSettings }));
    }, []),

    saveChanges: useCallback(() => {
      if (onSave) {
        onSave(elements, pageSettings);
      }
    }, [elements, pageSettings, onSave]),

    setCurrentBreakpoint: useCallback((breakpoint: BreakpointType) => {
      setCurrentBreakpoint(breakpoint);
    }, []),

    setPreviewBreakpoint: useCallback((breakpoint: BreakpointType) => {
      setPreviewBreakpoint(breakpoint);
    }, []),
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
