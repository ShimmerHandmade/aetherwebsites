
import { useContext } from "react";
import { BuilderContext } from "./BuilderProvider";
import { BuilderContextType } from "./types";

/**
 * Hook for accessing the BuilderContext
 * @returns BuilderContext value
 * @throws Error if used outside BuilderProvider
 */
export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  
  return context;
};

// For backward compatibility
export const useBuilderContext = useBuilder;
