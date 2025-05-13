
import * as React from "react";

export interface ToolbarDividerProps {
  className?: string;
}

export const ToolbarDivider: React.FC<ToolbarDividerProps> = ({ className }) => {
  return <div className={`h-6 w-px bg-gray-300 mx-2 opacity-70 ${className || ''}`} />;
};

export default ToolbarDivider;
