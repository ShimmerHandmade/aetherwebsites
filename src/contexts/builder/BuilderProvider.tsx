
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
  addElement: (element: BuilderElement, parentId?: string | null) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  canAddElement: (elementType: string) => boolean;
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

  useEffect(() => {
    const handleSave = () => {
      if (onSave) {
        onSave(elements, pageSettings);
      }
    };

    document.addEventListener('save-website', handleSave);
    return () => {
      document.removeEventListener('save-website', handleSave);
    };
  }, [elements, pageSettings, onSave]);

  const addElement = (element: BuilderElement, parentId: string | null = null) => {
    // Check if this is a premium element that the user doesn't have access to
    if ((isPremiumElement(element.type) && !isPremium) || 
        (isEnterpriseElement(element.type) && !isEnterprise)) {
        
      toast.error("Premium feature not available", {
        description: `This element is only available with ${isEnterpriseElement(element.type) ? 'Enterprise' : 'Professional or Enterprise'} plan`
      });
      return;
    }
  
    if (parentId) {
      // Add as a child of the specified parent
      setElements(prevElements =>
        prevElements.map(el => {
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
        })
      );
    } else {
      // Add as a top-level element
      setElements(prevElements => [...prevElements, element]);
    }
  };

  const updateElement = (id: string, updates: Partial<BuilderElement>) => {
    setElements(prevElements =>
      prevElements.map(el => {
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
      })
    );
  };

  const deleteElement = (id: string) => {
    // Handle deletion of top-level elements
    setElements(prevElements => prevElements.filter(el => el.id !== id));

    // Handle deletion of nested elements
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.children && el.children.length > 0) {
          // Recursively search for the element to delete in the children
          const findAndDeleteElement = (children: BuilderElement[]): BuilderElement[] => {
            return children.filter(child => {
              if (child.id === id) {
                return false;
              } else if (child.children && child.children.length > 0) {
                child.children = findAndDeleteElement(child.children);
              }
              return true;
            });
          };
          return {
            ...el,
            children: findAndDeleteElement(el.children)
          };
        }
        return el;
      })
    );

    // Clear selection if the deleted element was selected
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
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
        canAddElement
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
