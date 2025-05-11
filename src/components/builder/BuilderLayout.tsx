
import React, { ReactNode, useState } from "react";

interface BuilderLayoutProps {
  children: ReactNode;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className={`flex flex-col h-screen ${isPreviewMode ? 'preview-mode' : ''}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isPreviewMode, setIsPreviewMode });
        }
        return child;
      })}
    </div>
  );
};

export default BuilderLayout;
