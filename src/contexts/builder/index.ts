
export * from './types';
export * from './BuilderProvider'; // This already exports useBuilder
export * from './elementUtils';

// Re-export the renamed hook for backward compatibility
export { useBuilderContext } from './useBuilder';
