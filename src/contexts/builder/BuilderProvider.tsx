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
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState<PageSettings>(initialPageSettings);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>('desktop');
  const [previewBreakpoint, setPreviewBreakpoint] = useState<BreakpointType>('desktop');
  const [isInitialized, setIsInitialized] = useState(false);

  // Improved synchronization with initialElements
  useEffect(() => {
    console.log("🔄 BuilderProvider: initialElements changed:", {
      newLength: initialElements?.length || 0,
      currentLength: elements?.length || 0,
      isInitialized,
      newElements: initialElements
    });
    
    // Always update elements when initialElements changes, regardless of initialization state
    if (initialElements && Array.isArray(initialElements)) {
      setElements(initialElements);
      console.log("✅ BuilderProvider: Elements updated from initialElements");
      
      if (!isInitialized) {
        setIsInitialized(true);
        console.log("🎯 BuilderProvider: Initialized");
      }
    } else if (initialElements === null || initialElements === undefined) {
      // If initialElements is explicitly null/undefined, set empty array
      setElements([]);
      console.log("🧹 BuilderProvider: Elements cleared (null/undefined initialElements)");
      
      if (!isInitialized) {
        setIsInitialized(true);
        console.log("🎯 BuilderProvider: Initialized with empty elements");
      }
    }
  }, [initialElements, isInitialized]);

  // Update page settings when initialPageSettings changes
  useEffect(() => {
    console.log("🔄 BuilderProvider: initialPageSettings changed:", initialPageSettings);
    if (initialPageSettings) {
      setPageSettings(initialPageSettings);
    }
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

  const updateElementResponsive = useCallback((
    id: string, 
    breakpoint: BreakpointType, 
    responsiveUpdates: any
  ) => {
    console.log("🔄 Updating element responsive settings:", { id, breakpoint, responsiveUpdates });
    setElements(prevElements => {
      const updateElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
        return elementsToUpdate.map(element => {
          if (element.id === id) {
            const updated = {
              ...element,
              responsiveSettings: {
                ...element.responsiveSettings,
                [breakpoint]: responsiveUpdates
              }
            };
            console.log("✅ Element responsive settings updated:", updated);
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

  const value: BuilderContextType = {
    elements,
    selectedElementId,
    pageSettings,
    currentBreakpoint,
    previewBreakpoint,
    addElement: useCallback((
      element: BuilderElement, 
      index?: number, 
      parentId?: string | null
    ) => {
      console.log("🔄 Adding element:", { element: element.type, index, parentId });
      
      // Ensure element has an ID
      const elementWithId = {
        ...element,
        id: element.id || uuidv4()
      };
      
      setElements(prevElements => {
        try {
          let newElements = [...prevElements];
          
          if (parentId) {
            // Add to specific parent container
            const updateElementChildren = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
              return elementsToUpdate.map(el => {
                if (el.id === parentId) {
                  const children = el.children || [];
                  const newChildren = index !== undefined 
                    ? [...children.slice(0, index), elementWithId, ...children.slice(index)]
                    : [...children, elementWithId];
                  
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
              newElements.splice(index, 0, elementWithId);
            } else {
              newElements.push(elementWithId);
            }
            
            // Ensure proper element ordering (header, content, footer)
            newElements = ensureElementsOrder(newElements);
            console.log("📋 Added element to root with proper ordering");
          }
          
          console.log("✅ Element added successfully, new elements:", newElements);
          return newElements;
        } catch (error) {
          console.error("❌ Error adding element:", error);
          return prevElements; // Return previous state on error
        }
      });
    }, []),
    updateElement: useCallback((id: string, updates: Partial<BuilderElement>) => {
      console.log("🔄 Updating element:", { id, updates });
      setElements(prevElements => {
        try {
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
          
          const result = updateElementRecursively(prevElements);
          console.log("✅ Update complete");
          return result;
        } catch (error) {
          console.error("❌ Error updating element:", error);
          return prevElements;
        }
      });
    }, []),
    updateElementResponsive: useCallback((
      id: string, 
      breakpoint: BreakpointType, 
      responsiveUpdates: any
    ) => {
      console.log("🔄 Updating element responsive settings:", { id, breakpoint, responsiveUpdates });
      setElements(prevElements => {
        const updateElementRecursively = (elementsToUpdate: BuilderElement[]): BuilderElement[] => {
          return elementsToUpdate.map(element => {
            if (element.id === id) {
              const updated = {
                ...element,
                responsiveSettings: {
                  ...element.responsiveSettings,
                  [breakpoint]: responsiveUpdates
                }
              };
              console.log("✅ Element responsive settings updated:", updated);
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
    }, []),
    removeElement: useCallback((id: string) => {
      console.log("🗑️ Removing element:", id);
      setElements(prevElements => {
        try {
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
        } catch (error) {
          console.error("❌ Error removing element:", error);
          return prevElements;
        }
      });
      
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    }, [selectedElementId]),
    deleteElement: useCallback((id: string) => {
      console.log("🗑️ Deleting element (alias):", id);
      setElements(prevElements => {
        try {
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
        } catch (error) {
          console.error("❌ Error deleting element:", error);
          return prevElements;
        }
      });
      
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    }, [selectedElementId]),
    moveElement: useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
      console.log("🔄 Moving element:", { fromIndex, toIndex, parentId });
      setElements(prevElements => {
        try {
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
        } catch (error) {
          console.error("❌ Error moving element:", error);
          return prevElements;
        }
      });
    }, []),
    moveElementUp: useCallback((id: string) => {
      console.log("⬆️ Moving element up:", id);
      const findElementIndex = (id: string, parentId?: string): number => {
        if (parentId) {
          const findElementById = (id: string): BuilderElement | null => {
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
          };
          
          const parent = findElementById(parentId);
          if (parent?.children) {
            return parent.children.findIndex(el => el.id === id);
          }
          return -1;
        }
        return elements.findIndex(el => el.id === id);
      };
      
      const currentIndex = findElementIndex(id);
      if (currentIndex > 0) {
        setElements(prevElements => {
          const newElements = [...prevElements];
          const [movedElement] = newElements.splice(currentIndex, 1);
          newElements.splice(currentIndex - 1, 0, movedElement);
          
          // Ensure proper ordering after move
          const orderedElements = ensureElementsOrder(newElements);
          console.log("✅ Element moved up");
          return orderedElements;
        });
      }
    }, [elements]),
    moveElementDown: useCallback((id: string) => {
      console.log("⬇️ Moving element down:", id);
      const findElementIndex = (id: string, parentId?: string): number => {
        if (parentId) {
          const findElementById = (id: string): BuilderElement | null => {
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
          };
          
          const parent = findElementById(parentId);
          if (parent?.children) {
            return parent.children.findIndex(el => el.id === id);
          }
          return -1;
        }
        return elements.findIndex(el => el.id === id);
      };
      
      const currentIndex = findElementIndex(id);
      if (currentIndex >= 0 && currentIndex < elements.length - 1) {
        setElements(prevElements => {
          const newElements = [...prevElements];
          const [movedElement] = newElements.splice(currentIndex, 1);
          newElements.splice(currentIndex + 1, 0, movedElement);
          
          // Ensure proper ordering after move
          const orderedElements = ensureElementsOrder(newElements);
          console.log("✅ Element moved down");
          return orderedElements;
        });
      }
    }, [elements]),
    selectElement: useCallback((id: string | null) => {
      console.log("🎯 Selecting element:", id);
      setSelectedElementId(id);
    }, []),
    findElementById: useCallback((id: string): BuilderElement | null => {
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
    }, [elements]),
    duplicateElement: useCallback((id: string) => {
      console.log("📋 Duplicating element:", id);
      const findElementById = (id: string): BuilderElement | null => {
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
      };
      
      const findElementIndex = (id: string, parentId?: string): number => {
        if (parentId) {
          const parent = findElementById(parentId);
          if (parent?.children) {
            return parent.children.findIndex(el => el.id === id);
          }
          return -1;
        }
        return elements.findIndex(el => el.id === id);
      };
      
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
    }, [elements]),
    updatePageSettings: useCallback((newSettings: Partial<PageSettings>) => {
      console.log("🔄 Updating page settings:", newSettings);
      setPageSettings(prev => ({ ...prev, ...newSettings }));
    }, []),
    saveChanges: useCallback(() => {
      if (onSave) {
        console.log("💾 Saving changes:", { elements, pageSettings });
        onSave(elements, pageSettings);
      }
    }, [elements, pageSettings, onSave]),
    setCurrentBreakpoint: useCallback((breakpoint: BreakpointType) => {
      console.log("📱 Setting current breakpoint:", breakpoint);
      setCurrentBreakpoint(breakpoint);
    }, []),
    setPreviewBreakpoint: useCallback((breakpoint: BreakpointType) => {
      console.log("👀 Setting preview breakpoint:", breakpoint);
      setPreviewBreakpoint(breakpoint);
    }, []),
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
