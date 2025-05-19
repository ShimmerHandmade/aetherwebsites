
import React, { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define a common interface for components that can receive preview mode props
export interface PreviewModeProps {
  isPreviewMode?: boolean;
  setIsPreviewMode?: (value: boolean) => void;
  isLiveSite?: boolean;
}

interface BuilderLayoutProps extends PreviewModeProps {
  children: ReactNode;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ 
  children, 
  isPreviewMode = false, 
  setIsPreviewMode = () => {},
  isLiveSite = false
}) => {
  // Clone each child and pass the preview mode props
  const childrenWithProps = React.Children.map(children, child => {
    // Check if the child is a valid React element
    if (React.isValidElement(child)) {
      // Pass the preview mode props
      return React.cloneElement(child as React.ReactElement<any>, {
        isPreviewMode,
        setIsPreviewMode,
        isLiveSite
      });
    }
    return child;
  });

  return (
    <div className={`flex flex-col h-screen ${isPreviewMode ? 'preview-mode' : ''}`}>
      {childrenWithProps}
    </div>
  );
};

export default BuilderLayout;
