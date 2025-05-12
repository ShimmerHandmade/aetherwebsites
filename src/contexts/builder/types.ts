
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
  pageSettings: PageSettings;
  addElement: (element: BuilderElement, position?: number, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (sourceIndex: number, destinationIndex: number, parentId?: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  duplicateElement: (id: string) => void;
  loadElements: (elements: BuilderElement[]) => void;
  saveElements: () => BuilderElement[];
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  findElementById: (id: string) => BuilderElement | null;
}
