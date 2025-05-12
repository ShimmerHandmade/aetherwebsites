
import { useContext } from "react";
import { BuilderContext } from "./BuilderProvider";
import { BuilderContextType } from "./types";

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  
  return context;
};
