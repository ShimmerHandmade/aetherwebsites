import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { BuilderElement, PageSettings } from './types';
import { isPremiumElement, isEnterpriseElement } from './elementUtils';
import { usePlan } from '../PlanContext';
import { toast } from 'sonner';

interface BuilderContextType {
  elements: BuilderElement[];
  selectedElementId: string | null;
  hoveredElementId: string | null;
  isDraggingOver: boolean;
  pageSettings: PageSettings;
  setElements: (elements: BuilderElement[]) => void;
  setSelectedElementId: (id: string | null) => void;
  setHoveredElementId: (id: string | null) => void;
  setIsDraggingOver: (isDragging: boolean) => void;
  setPageSettings: (settings: PageSettings) => void;
  addElement: (element: BuilderElement, indexOrParentId?: number | string | null, containerId?: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  canAddElement: (elementType: string) => boolean;
  
  // Add the missing methods that components are using
  findElementById: (id: string) => BuilderElement | null;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => void;
  moveElement: (sourceIndex: number, destinationIndex: number, parentId?: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
}

export const BuilderContext = createContext<BuilderContextType | null>(null);

interface BuilderProviderProps {
  children: ReactNode;
  initialElements?: BuilderElement[];
  initialPageSettings?: PageSettings;
  onSave?: (elements: BuilderElement[], pageSettings: PageSettings) => void;
}

export const BuilderProvider = ({
  children,
  initialElements = [],
  initialPageSettings = { title: 'Untitled Page' },
  onSave
}: BuilderProviderProps) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [pageSettings, setPageSettings] = useState<PageSettings>(initialPageSettings);
  
  // Get plan information
  const { isPremium, isEnterprise } = usePlan();

  // Listen for save requests
  useEffect(() => {
    const handleSave = () => {
      if (onSave) {
        console.log("Save requested with current elements:", elements);
        onSave(elements, pageSettings);
      }
    };

    document.addEventListener('save-website', handleSave);
    return () => {
      document.removeEventListener('save-website', handleSave);
    };
  }, [elements, pageSettings, onSave]);

  // Update initial elements when they change from the parent component
  useEffect(() => {
    if (initialElements && initialElements.length > 0) {
      console.log("Initializing builder with elements:", initialElements);
      setElements(initialElements);
    }
  }, [initialElements]);

  // Update initial page settings when they change
  useEffect(() => {
    if (initialPageSettings) {
      setPageSettings(initialPageSettings);
    }
  }, [initialPageSettings]);

  // Notify content changes for auto-save
  const notifyContentChanged = () => {
    document.dispatchEvent(new CustomEvent('builder-content-changed'));
  };

  // Helper to find an element by its ID anywhere in the element tree
  const findElementById = (id: string): BuilderElement | null => {
    // Check top level elements
    const topLevelElement = elements.find(el => el.id === id);
    if (topLevelElement) return topLevelElement;

    // Recursively search through nested elements
    const searchNestedElements = (elementsArray: BuilderElement[]): BuilderElement | null => {
      for (const element of elementsArray) {
        if (element.id === id) return element;
        if (element.children && element.children.length > 0) {
          const found = searchNestedElements(element.children);
          if (found) return found;
        }
      }
      return null;
    };

    return searchNestedElements(elements);
  };

  // For backward compatibility
  const selectElement = (id: string | null) => {
    setSelectedElementId(id);
  };

  // For backward compatibility
  const removeElement = (id: string) => {
    deleteElement(id);
  };

  // Add element with support for both index and parent ID
  const addElement = (element: BuilderElement, indexOrParentId: number | string | null = null, containerId?: string) => {
    console.log(`Adding element ${element.type} with ID ${element.id}`, {
      indexOrParentId,
      containerId,
      element
    });

    // Check if this is a premium element that the user doesn't have access to
    if ((isPremiumElement(element.type) && !isPremium) || 
        (isEnterpriseElement(element.type) && !isEnterprise)) {
        
      toast.error("Premium feature not available", {
        description: `This element is only available with ${isEnterpriseElement(element.type) ? 'Enterprise' : 'Professional or Enterprise'} plan`
      });
      return;
    }

    // If containerId is specified, use it to find the parent
    if (containerId) {
      setElements(prevElements => {
        const updateChildrenRecursively = (elements: BuilderElement[]): BuilderElement[] => {
          return elements.map(el => {
            if (el.id === containerId) {
              // If indexOrParentId is a number, use it as insert index
              if (typeof indexOrParentId === 'number') {
                const newChildren = [...(el.children || [])];
                newChildren.splice(indexOrParentId, 0, element);
                console.log(`Inserting element at index ${indexOrParentId} in container ${containerId}`);
                return {
                  ...el,
                  children: newChildren
                };
              } else {
                // Otherwise just append to the end
                console.log(`Appending element to end of container ${containerId}`);
                return {
                  ...el,
                  children: [...(el.children || []), element]
                };
              }
            }
            
            // Recursively search for the container in children
            if (el.children && el.children.length > 0) {
              return {
                ...el,
                children: updateChildrenRecursively(el.children)
              };
            }
            
            return el;
          });
        };
        
        const updated = updateChildrenRecursively(prevElements);
        notifyContentChanged();
        return updated;
      });
      return;
    }

    // If it's a number, treat it as an index for inserting at that position in root elements
    if (typeof indexOrParentId === 'number') {
      setElements(prevElements => {
        const newElements = [...prevElements];
        newElements.splice(indexOrParentId, 0, element);
        notifyContentChanged();
        return newElements;
      });
      return;
    }
  
    // Otherwise, treat it as a parentId for legacy support
    const parentId = indexOrParentId as string | null;
    
    if (parentId) {
      // Add as a child of the specified parent
      setElements(prevElements => {
        const updatedElements = prevElements.map(el => {
          if (el.id === parentId) {
            return {
              ...el,
              children: [...(el.children || []), element]
            };
          } else if (el.children && el.children.length > 0) {
            // Recursively search for the parent in the children
            const findAndAddToParent = (children: BuilderElement[]): BuilderElement[] => {
              return children.map(child => {
                if (child.id === parentId) {
                  return {
                    ...child,
                    children: [...(child.children || []), element]
                  };
                } else if (child.children && child.children.length > 0) {
                  return {
                    ...child,
                    children: findAndAddToParent(child.children)
                  };
                }
                return child;
              });
            };
            return {
              ...el,
              children: findAndAddToParent(el.children)
            };
          }
          return el;
        });
        notifyContentChanged();
        return updatedElements;
      });
    } else {
      // Add as a top-level element
      setElements(prevElements => {
        const updatedElements = [...prevElements, element];
        notifyContentChanged();
        return updatedElements;
      });
    }
  };

  const updateElement = (id: string, updates: Partial<BuilderElement>) => {
    setElements(prevElements => {
      const updatedElements = prevElements.map(el => {
        if (el.id === id) {
          return { ...el, ...updates };
        } else if (el.children && el.children.length > 0) {
          // Recursively search for the element to update in the children
          const findAndUpdateElement = (children: BuilderElement[]): BuilderElement[] => {
            return children.map(child => {
              if (child.id === id) {
                return { ...child, ...updates };
              } else if (child.children && child.children.length > 0) {
                return {
                  ...child,
                  children: findAndUpdateElement(child.children)
                };
              }
              return child;
            });
          };
          return {
            ...el,
            children: findAndUpdateElement(el.children)
          };
        }
        return el;
      });
      notifyContentChanged();
      return updatedElements;
    });
  };

  const deleteElement = (id: string) => {
    // First try to handle deletion of top-level elements
    setElements(prevElements => {
      const filteredTopLevelElements = prevElements.filter(el => el.id !== id);
      
      // If we found and removed a top-level element
      if (filteredTopLevelElements.length !== prevElements.length) {
        console.log(`Deleted top-level element with ID: ${id}`);
        console.log("New elements array:", filteredTopLevelElements);
        notifyContentChanged();
        return filteredTopLevelElements;
      }
      
      // If not a top-level element, let's check in children recursively
      const processNestedElements = (elemArray: BuilderElement[]): [BuilderElement[], boolean] => {
        let hasChanged = false;
        const processed = elemArray.map(el => {
          if (el.children && el.children.length > 0) {
            // First check direct children
            const filteredChildren = el.children.filter(child => child.id !== id);
            
            // If we found and removed a direct child
            if (filteredChildren.length !== el.children.length) {
              hasChanged = true;
              return { ...el, children: filteredChildren };
            }
            
            // If not found in direct children, check deeper
            const [processedChildren, deeperChange] = processNestedElements(el.children);
            if (deeperChange) {
              hasChanged = true;
              return { ...el, children: processedChildren };
            }
          }
          return el;
        });
        
        return [processed, hasChanged];
      };
      
      const [processedElements, hasChanged] = processNestedElements(prevElements);
      
      if (hasChanged) {
        console.log(`Deleted nested element with ID: ${id}`);
        console.log("New elements array:", processedElements);
        notifyContentChanged();
        return processedElements;
      }
      
      // If we reach here, we couldn't find the element
      console.warn(`Could not find element with ID: ${id} to delete`);
      return prevElements;
    });

    // Clear selection if the deleted element was selected
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Move element from one position to another
  const moveElement = (sourceIndex: number, destinationIndex: number, parentId?: string) => {
    // Handle top-level elements if no parentId specified
    if (!parentId) {
      setElements(prevElements => {
        const newElements = [...prevElements];
        const [removed] = newElements.splice(sourceIndex, 1);
        newElements.splice(destinationIndex, 0, removed);
        notifyContentChanged();
        return newElements;
      });
      return;
    }
    
    // Handle movement within a container
    setElements(prevElements => {
      let hasChanged = false;
      
      const updatedElements = prevElements.map(el => {
        if (el.id === parentId && el.children) {
          hasChanged = true;
          const newChildren = [...el.children];
          const [removed] = newChildren.splice(sourceIndex, 1);
          newChildren.splice(destinationIndex, 0, removed);
          return { ...el, children: newChildren };
        } else if (el.children) {
          // Search recursively
          const findAndMove = (children: BuilderElement[]): [BuilderElement[], boolean] => {
            let updated = false;
            const updatedChildren = children.map(child => {
              if (child.id === parentId && child.children) {
                updated = true;
                const newChildren = [...child.children];
                const [removed] = newChildren.splice(sourceIndex, 1);
                newChildren.splice(destinationIndex, 0, removed);
                return { ...child, children: newChildren };
              } else if (child.children) {
                const [newChildren, childUpdated] = findAndMove(child.children);
                if (childUpdated) {
                  updated = true;
                  return { ...child, children: newChildren };
                }
              }
              return child;
            });
            return [updatedChildren, updated];
          };
          
          const [newChildren, updated] = findAndMove(el.children);
          if (updated) {
            hasChanged = true;
            return { ...el, children: newChildren };
          }
        }
        return el;
      });
      
      if (hasChanged) {
        notifyContentChanged();
        return updatedElements;
      }
      return prevElements;
    });
  };

  // Move element up in its container
  const moveElementUp = (id: string) => {
    // Find the element and its parent
    let parentId: string | null = null;
    let index = -1;
    
    // Check if it's a top-level element
    index = elements.findIndex(el => el.id === id);
    if (index > 0) {
      // Move up in the top-level array
      moveElement(index, index - 1);
      return;
    }
    
    // It's a nested element, find its parent and position
    const findElementPosition = (elementsArray: BuilderElement[], parent: string | null = null): [number, string | null] | null => {
      for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i].id === id) {
          return [i, parent];
        }
        if (elementsArray[i].children && elementsArray[i].children.length > 0) {
          const result = findElementPosition(elementsArray[i].children, elementsArray[i].id);
          if (result) return result;
        }
      }
      return null;
    };
    
    const position = findElementPosition(elements);
    if (position && position[0] > 0) {
      // Move up within its parent container
      moveElement(position[0], position[0] - 1, position[1]);
    }
  };
  
  // Move element down in its container
  const moveElementDown = (id: string) => {
    // Find the element and its parent
    let parentId: string | null = null;
    let index = -1;
    
    // Check if it's a top-level element
    index = elements.findIndex(el => el.id === id);
    if (index !== -1 && index < elements.length - 1) {
      // Move down in the top-level array
      moveElement(index, index + 1);
      return;
    }
    
    // It's a nested element, find its parent and position
    const findElementPosition = (elementsArray: BuilderElement[], parent: string | null = null): [number, string | null, number] | null => {
      for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i].id === id) {
          return [i, parent, elementsArray.length];
        }
        if (elementsArray[i].children && elementsArray[i].children.length > 0) {
          const result = findElementPosition(elementsArray[i].children, elementsArray[i].id);
          if (result) return result;
        }
      }
      return null;
    };
    
    const position = findElementPosition(elements);
    if (position && position[0] < position[2] - 1) {
      // Move down within its parent container
      moveElement(position[0], position[0] + 1, position[1]);
    }
  };

  // Duplicate an element
  const duplicateElement = (id: string) => {
    const element = findElementById(id);
    if (!element) return;
    
    // Create a deep copy with new IDs
    const createCopyWithNewIds = (el: BuilderElement): BuilderElement => {
      const newId = `${el.id}-copy-${Math.random().toString(36).substr(2, 9)}`;
      const copy = { ...el, id: newId };
      
      if (el.children && el.children.length > 0) {
        copy.children = el.children.map(createCopyWithNewIds);
      }
      
      return copy;
    };
    
    const duplicated = createCopyWithNewIds(element);
    
    // Find where to insert the duplicate
    const findElementPosition = (elementsArray: BuilderElement[], parent: string | null = null): [number, string | null] | null => {
      for (let i = 0; i < elementsArray.length; i++) {
        if (elementsArray[i].id === id) {
          return [i, parent];
        }
        if (elementsArray[i].children && elementsArray[i].children.length > 0) {
          const result = findElementPosition(elementsArray[i].children, elementsArray[i].id);
          if (result) return result;
        }
      }
      return null;
    };
    
    const position = findElementPosition(elements);
    if (position) {
      // Add the duplicate right after the original
      if (position[1]) {
        addElement(duplicated, position[0] + 1, position[1]);
      } else {
        // It's a top-level element
        setElements(prevElements => {
          const newElements = [...prevElements];
          newElements.splice(position[0] + 1, 0, duplicated);
          notifyContentChanged();
          return newElements;
        });
      }
    }
  };

  // Update page settings
  const updatePageSettings = (settings: Partial<PageSettings>) => {
    setPageSettings(prev => {
      const updatedSettings = {
        ...prev,
        ...settings,
        meta: {
          ...(prev.meta || {}),
          ...(settings.meta || {})
        }
      };
      notifyContentChanged();
      return updatedSettings;
    });
  };

  // Function to check if a user can add an element based on their plan
  const canAddElement = (elementType: string): boolean => {
    if (isPremiumElement(elementType) && !isPremium) {
      return false;
    }
    
    if (isEnterpriseElement(elementType) && !isEnterprise) {
      return false;
    }
    
    return true;
  };

  return (
    <BuilderContext.Provider
      value={{
        elements,
        selectedElementId,
        hoveredElementId,
        isDraggingOver,
        pageSettings,
        setElements,
        setSelectedElementId,
        setHoveredElementId,
        setIsDraggingOver,
        setPageSettings,
        addElement,
        updateElement,
        deleteElement,
        canAddElement,
        // Additional methods
        findElementById,
        removeElement,
        selectElement,
        duplicateElement,
        moveElement,
        moveElementUp,
        moveElementDown,
        updatePageSettings
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === null) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
