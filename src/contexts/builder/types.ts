
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

export interface BuilderContextType {
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
  
  // Add the missing properties that components are using
  findElementById: (id: string) => BuilderElement | null;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  duplicateElement: (id: string) => void;
  moveElement: (sourceIndex: number, destinationIndex: number, parentId?: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
}
