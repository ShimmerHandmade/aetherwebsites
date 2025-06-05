
import React from 'react';

interface BuilderLayoutProps {
  children: React.ReactNode;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex">
      {children}
    </div>
  );
};

export default BuilderLayout;
