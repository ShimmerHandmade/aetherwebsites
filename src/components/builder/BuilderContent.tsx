
import React, { useState } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Edit } from "lucide-react";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Check if we're in full preview mode via URL parameter
  const isFullPreview = isPreviewMode && new URLSearchParams(window.location.search).get('preview') === 'true';

  // For full preview mode, render just the canvas without any UI controls
  if (isFullPreview) {
    return (
      <div className="flex-1 min-h-screen">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  // Regular preview mode or edit mode
  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-slate-100 overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Left sidebar - visible on desktop - width increased */}
      <div className="hidden md:block w-[220px] bg-white border-r border-slate-200">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
        <PageEditorSidebar isPreviewMode={isPreviewMode} />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-slate-100 overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} />
        
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
        
        {/* Element editing actions - inspired by Squarespace */}
        <div className="hidden group-hover:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col gap-2">
          <Button variant="secondary" size="icon" className="bg-white shadow-md rounded-full">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderContent;
