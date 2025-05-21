
import React, { useState, useEffect, useRef } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Edit } from "lucide-react";
import { useBuilder } from "@/contexts/builder/useBuilder";

// Extend the interface to include isLiveSite
interface BuilderContentProps extends PreviewModeProps {
  isLiveSite?: boolean;
}

const BuilderContent: React.FC<BuilderContentProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  // Regular preview mode or edit mode
  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-slate-100 overflow-auto" ref={contentRef}>
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
    <div className="flex-1 flex" ref={contentRef}>
      {/* Left sidebar - visible on desktop */}
      <div className="hidden md:block w-[220px] bg-white border-r border-slate-200">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
        <PageEditorSidebar isPreviewMode={isPreviewMode} />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-slate-100 overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} isLiveSite={isLiveSite} />
        
        {/* Mobile view: Bottom Drawer trigger */}
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="default"
              size="sm" 
              className="fixed bottom-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white shadow-md md:hidden rounded-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <div className="px-4 pt-4 pb-8">
              <PageEditorSidebar isPreviewMode={isPreviewMode} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default React.memo(BuilderContent);
