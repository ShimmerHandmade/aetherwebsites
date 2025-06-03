
export interface BuilderElement {
  id: string;
  type: string;
  content?: string;
  props?: Record<string, any>;
  children?: BuilderElement[];
  responsiveSettings?: {
    mobile?: {
      hidden?: boolean;
      order?: number;
      className?: string;
      props?: Record<string, any>;
    };
    tablet?: {
      hidden?: boolean;
      order?: number;
      className?: string;
      props?: Record<string, any>;
    };
    desktop?: {
      hidden?: boolean;
      order?: number;
      className?: string;
      props?: Record<string, any>;
    };
  };
}

export interface PageSettings {
  title: string;
  description?: string;
  keywords?: string;
  favicon?: string;
  customCSS?: string;
  customJS?: string;
  visible?: boolean;
  passwordProtected?: boolean;
  meta?: {
    title?: string;
    description?: string;
    canonical?: string;
    indexable?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    redirectUrl?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  pages?: Array<{
    id: string;
    title: string;
    path: string;
    isHome?: boolean;
  }>;
  pagesContent?: Record<string, BuilderElement[]>;
  pagesSettings?: Record<string, PageSettings>;
}

export type BreakpointType = 'mobile' | 'tablet' | 'desktop';

export interface BuilderContextType {
  elements: BuilderElement[];
  selectedElementId: string | null;
  pageSettings: PageSettings;
  currentBreakpoint: BreakpointType;
  previewBreakpoint: BreakpointType;
  addElement: (element: BuilderElement, index?: number, parentId?: string | null) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  updateElementResponsive: (id: string, breakpoint: BreakpointType, updates: any) => void;
  removeElement: (id: string) => void;
  deleteElement: (id: string) => void;
  moveElement: (fromIndex: number, toIndex: number, parentId?: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  selectElement: (id: string | null) => void;
  findElementById: (id: string) => BuilderElement | null;
  duplicateElement: (id: string) => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  saveChanges: () => void;
  setCurrentBreakpoint: (breakpoint: BreakpointType) => void;
  setPreviewBreakpoint: (breakpoint: BreakpointType) => void;
}
