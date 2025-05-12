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

  // Load initial elements when provided or when they change
  useEffect(() => {
    console.log("InitialElements changed in BuilderProvider", initialElements);
    setElements(initialElements);
    setSelectedElementId(null);
  }, [initialElements]);

  // Load initial page settings when provided or when they change
  useEffect(() => {
    console.log("InitialPageSettings changed in BuilderProvider", initialPageSettings);
    setPageSettings(initialPageSettings);
  }, [initialPageSettings]);

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

  // Improved moveElement function with proper parameters
  const moveElement = (
    sourceIndex: number, 
    destinationIndex: number, 
    sourceParentId?: string,
    targetParentId?: string
  ) => {
    console.log(`Move element: sourceIndex=${sourceIndex}, destIndex=${destinationIndex}, sourceParent=${sourceParentId}, targetParent=${targetParentId}`);
    
    // Case 1: Moving within the same parent container
    if (sourceParentId === targetParentId) {
      if (!sourceParentId) {
        // Moving at root level
        setElements((prev) => {
          const result = Array.from(prev);
          // Check if the sourceIndex is valid
          if (sourceIndex >= 0 && sourceIndex < result.length) {
            const [removed] = result.splice(sourceIndex, 1);
            result.splice(destinationIndex, 0, removed);
          } else {
            console.error("Invalid source index for root level move:", sourceIndex);
          }
          return result;
        });
      } else {
        // Moving within a nested container
        setElements((prev) => {
          return updateElementInTree(prev, sourceParentId, parent => {
            const children = [...(parent.children || [])];
            // Check if the sourceIndex is valid
            if (sourceIndex >= 0 && sourceIndex < children.length) {
              const [removed] = children.splice(sourceIndex, 1);
              children.splice(destinationIndex, 0, removed);
            } else {
              console.error("Invalid source index for container move:", sourceIndex);
            }
            return {
              ...parent,
              children
            };
          });
        });
      }
      return;
    }
    
    // Case 2: Moving between different containers
    // This is more complex and requires:
    // 1. Get the element from the source location
    // 2. Remove it from the source
    // 3. Add it to the destination
    
    // First, get a reference to the element being moved
    let elementToMove: BuilderElement | null = null;
    
    if (!sourceParentId) {
      // Element is at the root level
      if (sourceIndex >= 0 && sourceIndex < elements.length) {
        elementToMove = { ...elements[sourceIndex] }; // Clone to avoid reference issues
      }
    } else {
      // Element is in a container
      const sourceContainer = findElementById(sourceParentId);
      if (sourceContainer && sourceContainer.children && 
          sourceIndex >= 0 && sourceIndex < sourceContainer.children.length) {
        elementToMove = { ...sourceContainer.children[sourceIndex] }; // Clone to avoid reference issues
      }
    }
    
    if (!elementToMove) {
      console.error("Element to move not found or invalid indexes");
      return;
    }
    
    // Now remove the element from its source location and add to destination
    setElements(prev => {
      let updatedElements = [...prev];
      
      if (!sourceParentId) {
        // Remove from root level
        updatedElements = updatedElements.filter((_, idx) => idx !== sourceIndex);
      } else {
        // Remove from container
        updatedElements = updateElementInTree(updatedElements, sourceParentId, parent => {
          const updatedChildren = (parent.children || []).filter((_, idx) => idx !== sourceIndex);
          return {
            ...parent,
            children: updatedChildren
          };
        });
      }
      
      // Now add it to the destination
      if (!targetParentId) {
        // Add to root level
        // Protect against out of bounds insertion
        const insertIndex = Math.min(destinationIndex, updatedElements.length);
        updatedElements.splice(insertIndex, 0, elementToMove!);
      } else {
        // Add to container
        updatedElements = updateElementInTree(updatedElements, targetParentId, parent => {
          const updatedChildren = [...(parent.children || [])];
          // Protect against out of bounds insertion
          const insertIndex = Math.min(destinationIndex, updatedChildren.length);
          updatedChildren.splice(insertIndex, 0, elementToMove!);
          return {
            ...parent,
            children: updatedChildren
          };
        });
      }
      
      return updatedElements;
    });
  };
  
  // New function to move an element up in the list
  const moveElementUp = (id: string) => {
    // Find the element and its parent
    const element = findElementById(id);
    if (!element) return;
    
    // Find the parent container and the element's index
    let parentId: string | undefined;
    let elementIndex = -1;
    
    // Check if element is at the root level
    const rootIndex = elements.findIndex(e => e.id === id);
    if (rootIndex !== -1) {
      elementIndex = rootIndex;
      
      // Can't move up if already at the top
      if (rootIndex === 0) {
        console.log("Element is already at the top of the root level");
        return;
      }
      
      // Move the element up one position
      setElements(prev => {
        const result = Array.from(prev);
        // Swap with the element above
        [result[rootIndex], result[rootIndex - 1]] = [result[rootIndex - 1], result[rootIndex]];
        return result;
      });
      return;
    }
    
    // Search for the element in all containers
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
    
    // If found in a container, move it up
    if (parentId && elementIndex > 0) {
      setElements((prev) => {
        return updateElementInTree(prev, parentId!, parent => {
          const children = [...(parent.children || [])];
          // Swap with the element above
          [children[elementIndex], children[elementIndex - 1]] = [children[elementIndex - 1], children[elementIndex]];
          return {
            ...parent,
            children
          };
        });
      });
    } else if (parentId && elementIndex === 0) {
      console.log("Element is already at the top of its container");
    }
  };
  
  // New function to move an element down in the list
  const moveElementDown = (id: string) => {
    // Find the element and its parent
    const element = findElementById(id);
    if (!element) return;
    
    // Find the parent container and the element's index
    let parentId: string | undefined;
    let elementIndex = -1;
    
    // Check if element is at the root level
    const rootIndex = elements.findIndex(e => e.id === id);
    if (rootIndex !== -1) {
      elementIndex = rootIndex;
      
      // Can't move down if already at the bottom
      if (rootIndex === elements.length - 1) {
        console.log("Element is already at the bottom of the root level");
        return;
      }
      
      // Move the element down one position
      setElements(prev => {
        const result = Array.from(prev);
        // Swap with the element below
        [result[rootIndex], result[rootIndex + 1]] = [result[rootIndex + 1], result[rootIndex]];
        return result;
      });
      return;
    }
    
    // Search for the element in all containers
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
    
    // If found in a container, move it down
    if (parentId && elementIndex !== -1 && elementIndex < (findElementById(parentId)?.children?.length || 0) - 1) {
      setElements((prev) => {
        return updateElementInTree(prev, parentId!, parent => {
          const children = [...(parent.children || [])];
          // Swap with the element below
          [children[elementIndex], children[elementIndex + 1]] = [children[elementIndex + 1], children[elementIndex]];
          return {
            ...parent,
            children
          };
        });
      });
    } else if (parentId && elementIndex === (findElementById(parentId)?.children?.length || 0) - 1) {
      console.log("Element is already at the bottom of its container");
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

  // Add event listener for saving
  useEffect(() => {
    const handleSaveEvent = () => {
      if (onSave) {
        onSave(elements, pageSettings);
      }
    };
    
    document.addEventListener('save-website', handleSaveEvent);
    
    return () => {
      document.removeEventListener('save-website', handleSaveEvent);
    };
  }, [elements, pageSettings, onSave]);

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
        moveElementUp,
        moveElementDown,
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
