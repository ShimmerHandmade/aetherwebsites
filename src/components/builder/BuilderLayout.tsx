
import React, { ReactNode, useState } from "react";

interface BuilderLayoutProps {
  children: ReactNode;
}

// Define a common interface for components that can receive preview mode props
export interface PreviewModeProps {
  isPreviewMode?: boolean;
  setIsPreviewMode?: (value: boolean) => void;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className={`flex flex-col h-screen ${isPreviewMode ? 'preview-mode' : ''}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            isPreviewMode, 
            setIsPreviewMode
          });
        }
        return child;
      })}
    </div>
  );
};

export default BuilderLayout;
