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
  // Simplified state initialization
  const [elements, setElements] = useState<BuilderElement[]>(() => {
    console.log("🚀 BuilderProvider: Initial elements:", initialElements);
    const safeElements = Array.isArray(initialElements) ? initialElements : [];
    console.log("🚀 BuilderProvider: Safe elements:", safeElements);
    return safeElements;
  });
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(() => {
    console.log("🚀 BuilderProvider: Initial pageSettings:", initialPageSettings);
    const safeSettings = initialPageSettings || { title: "Untitled Page" };
    console.log("🚀 BuilderProvider: Safe pageSettings:", safeSettings);
    return safeSettings;
  });
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>('desktop');
  const [previewBreakpoint, setPreviewBreakpoint] = useState<BreakpointType>('desktop');

  console.log("🔄 BuilderProvider: Current state", {
    elementsCount: elements?.length || 0,
    elementsValid: Array.isArray(elements),
    selectedElementId,
    pageSettingsTitle: pageSettings?.title
  });

  // Simple prop updates - only when they actually change
  useEffect(() => {
    console.log("🔄 BuilderProvider: Elements prop changed", {
      newElements: initialElements?.length || 0,
      currentElements: elements?.length || 0
    });
    
    if (Array.isArray(initialElements) && JSON.stringify(initialElements) !== JSON.stringify(elements)) {
      console.log("📝 BuilderProvider: Updating elements");
      setElements(initialElements);
    }
  }, [initialElements]);

  useEffect(() => {
    console.log("🔄 BuilderProvider: PageSettings prop changed", initialPageSettings);
    
    if (initialPageSettings && JSON.stringify(initialPageSettings) !== JSON.stringify(pageSettings)) {
      console.log("📝 BuilderProvider: Updating pageSettings");
      setPageSettings(initialPageSettings);
    }
  }, [initialPageSettings]);

  // Save handler
  useEffect(() => {
    const handleSaveRequest = () => {
      console.log("💾 BuilderProvider: Save requested", { 
        hasOnSave: !!onSave,
        elementsCount: elements?.length || 0,
        pageSettingsTitle: pageSettings?.title
      });
      
      try {
        if (onSave && Array.isArray(elements) && pageSettings) {
          onSave(elements, pageSettings);
        }
      } catch (error) {
        console.error("❌ BuilderProvider: Save error:", error);
      }
    };

    document.addEventListener('request-save-data', handleSaveRequest);
    return () => document.removeEventListener('request-save-data', handleSaveRequest);
  }, [elements, pageSettings, onSave]);

  const findElementById = useCallback((id: string): BuilderElement | null => {
    if (!Array.isArray(elements)) {
      console.warn("⚠️ BuilderProvider: Elements not an array in findElementById");
      return null;
    }
    
    const searchElements = (elementsToSearch: BuilderElement[]): BuilderElement | null => {
      for (const element of elementsToSearch) {
        if (element?.id === id) return element;
        if (element?.children && Array.isArray(element.children)) {
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
      
      try {
        const elementWithId = { ...element, id: element.id || uuidv4() };
        
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) {
            console.warn("⚠️ BuilderProvider: Previous elements not an array");
            return [elementWithId];
          }
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error adding element:", error);
      }
    }, []),

    updateElement: useCallback((id: string, updates: Partial<BuilderElement>) => {
      console.log("🔄 BuilderProvider: Updating element", { id, updates });
      
      try {
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) {
            console.warn("⚠️ BuilderProvider: Previous elements not an array");
            return prevElements;
          }
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error updating element:", error);
      }
    }, []),

    updateElementResponsive: useCallback((id: string, breakpoint: BreakpointType, responsiveUpdates: any) => {
      try {
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) return prevElements;
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error updating responsive element:", error);
      }
    }, []),

    removeElement: useCallback((id: string) => {
      console.log("🗑️ BuilderProvider: Removing element", id);
      
      try {
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) return prevElements;
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error removing element:", error);
      }
    }, [selectedElementId]),

    deleteElement: useCallback((id: string) => {
      console.log("🗑️ BuilderProvider: Deleting element", id);
      
      try {
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) return prevElements;
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error deleting element:", error);
      }
    }, [selectedElementId]),

    moveElement: useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
      try {
        setElements(prevElements => {
          if (!Array.isArray(prevElements)) return prevElements;
          
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
      } catch (error) {
        console.error("❌ BuilderProvider: Error moving element:", error);
      }
    }, []),

    moveElementUp: useCallback((id: string) => {
      try {
        const currentIndex = elements.findIndex(el => el.id === id);
        if (currentIndex > 0) {
          setElements(prevElements => {
            if (!Array.isArray(prevElements)) return prevElements;
            const newElements = [...prevElements];
            const [movedElement] = newElements.splice(currentIndex, 1);
            newElements.splice(currentIndex - 1, 0, movedElement);
            return ensureElementsOrder(newElements);
          });
        }
      } catch (error) {
        console.error("❌ BuilderProvider: Error moving element up:", error);
      }
    }, [elements]),

    moveElementDown: useCallback((id: string) => {
      try {
        const currentIndex = elements.findIndex(el => el.id === id);
        if (currentIndex >= 0 && currentIndex < elements.length - 1) {
          setElements(prevElements => {
            if (!Array.isArray(prevElements)) return prevElements;
            const newElements = [...prevElements];
            const [movedElement] = newElements.splice(currentIndex, 1);
            newElements.splice(currentIndex + 1, 0, movedElement);
            return ensureElementsOrder(newElements);
          });
        }
      } catch (error) {
        console.error("❌ BuilderProvider: Error moving element down:", error);
      }
    }, [elements]),

    selectElement: useCallback((id: string | null) => {
      console.log("🎯 BuilderProvider: Selecting element:", id);
      setSelectedElementId(id);
    }, []),

    findElementById,

    duplicateElement: useCallback((id: string) => {
      try {
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
            if (!Array.isArray(prevElements)) return prevElements;
            const newElements = [...prevElements];
            newElements.splice(currentIndex + 1, 0, duplicated);
            return newElements;
          });
        }
      } catch (error) {
        console.error("❌ BuilderProvider: Error duplicating element:", error);
      }
    }, [elements, findElementById]),

    updatePageSettings: useCallback((newSettings: Partial<PageSettings>) => {
      console.log("📄 BuilderProvider: Updating page settings:", newSettings);
      try {
        setPageSettings(prev => ({ ...prev, ...newSettings }));
      } catch (error) {
        console.error("❌ BuilderProvider: Error updating page settings:", error);
      }
    }, []),

    saveChanges: useCallback(() => {
      try {
        if (onSave) {
          onSave(elements, pageSettings);
        }
      } catch (error) {
        console.error("❌ BuilderProvider: Error saving changes:", error);
      }
    }, [elements, pageSettings, onSave]),

    setCurrentBreakpoint: useCallback((breakpoint: BreakpointType) => {
      setCurrentBreakpoint(breakpoint);
    }, []),

    setPreviewBreakpoint: useCallback((breakpoint: BreakpointType) => {
      setPreviewBreakpoint(breakpoint);
    }, []),
  };

  console.log("✅ BuilderProvider: Returning context value", {
    elementsCount: value.elements?.length || 0,
    hasCallbacks: Object.keys(value).filter(key => typeof value[key] === 'function').length
  });

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
