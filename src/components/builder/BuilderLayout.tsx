
import React, { ReactNode } from "react";

interface BuilderLayoutProps {
  children: ReactNode;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {children}
    </div>
  );
};

export default BuilderLayout;
