
import React, { useState, useEffect, useRef } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import { useBuilder } from "@/contexts/builder/useBuilder";

interface BuilderContentProps {
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
}

const BuilderContent: React.FC<BuilderContentProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { elements } = useBuilder();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  useEffect(() => {
    if (!contentLoaded) {
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [contentLoaded]);

  if (!contentLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 overflow-auto" ref={contentRef}>
      <BuilderCanvas isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
    </div>
  );
};

export default React.memo(BuilderContent);
