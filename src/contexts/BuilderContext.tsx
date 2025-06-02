
// This file re-exports everything from the new modularized builder context files
// This maintains backward compatibility while we migrate to the new structure
export * from './builder';
export { useBuilder } from './builder/useBuilder';
export { hasRequiredStructure, getContentInsertionIndex, ensureElementsOrder } from './builder/pageStructureUtils';
export interface BuilderContextType { selectedElement: ElementType | null; setSelectedElement: (el: ElementType | null) => void;}
