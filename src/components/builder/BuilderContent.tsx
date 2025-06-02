
import React, { useState, useEffect, useRef } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import { useBuilder } from "@/contexts/builder/useBuilder";

// Extend the interface to include isLiveSite
interface BuilderContentProps {
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
}

const detectCustomDomain = () => {
  const hostname = window.location.hostname;
  return hostname !== 'localhost' && 
         !hostname.includes('127.0.0.1') && 
         !hostname.includes('lovable.app') && 
         !hostname.includes('localhost');
};

// Set a global flag for use in other components
if (typeof window !== 'undefined') {
  window.__IS_CUSTOM_DOMAIN = detectCustomDomain();
}

const BuilderContent: React.FC<BuilderContentProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const { elements } = useBuilder();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  // Mount content once and avoid re-renders
  useEffect(() => {
    // Only set loaded state once to prevent flicker
    if (!contentLoaded) {
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [contentLoaded]);

  // Always check if we're on the /site/:id route to ensure we're in full preview mode
  const isSiteRoute = window.location.pathname.includes('/site/');
  const isFullPreview = isPreviewMode && (isSiteRoute || new URLSearchParams(window.location.search).get('preview') === 'true');

  // For full preview mode, render just the canvas without any UI controls
  if (isFullPreview || isSiteRoute) {
    return (
      <div className="flex-1 min-h-screen" ref={contentRef}>
        <BuilderCanvas isPreviewMode={true} isLiveSite={isLiveSite} />
      </div>
    );
  }

  // Render only when content is ready
  if (!contentLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
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
