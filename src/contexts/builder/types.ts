
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
  addElement: (element: BuilderElement, index?: number, parentId?: string | null) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  removeElement: (id: string) => void;
  deleteElement: (id: string) => void; // Alias for removeElement
  moveElement: (fromIndex: number, toIndex: number, parentId?: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  selectElement: (id: string | null) => void;
  findElementById: (id: string) => BuilderElement | null;
  duplicateElement: (id: string) => void;
  updatePageSettings: (newSettings: Partial<PageSettings>) => void;
  saveChanges: () => void;
}
