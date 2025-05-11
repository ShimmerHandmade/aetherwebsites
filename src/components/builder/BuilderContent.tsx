
import React, { useState } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight, Edit } from "lucide-react";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-slate-100 overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Left sidebar - visible on desktop - width increased from 60px to 80px */}
      <div className="hidden md:block w-[100px] bg-slate-900">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-slate-100 overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} />
        
        {/* Desktop view: Side panel for editor */}
        <div 
          className={`hidden md:block fixed top-[60px] bottom-0 right-0 w-[400px] transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } shadow-lg z-10`}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute top-4 -left-10 bg-white border border-slate-200 rounded-l-md rounded-r-none h-16 w-10 ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <PageEditorSidebar isPreviewMode={isPreviewMode} />
        </div>
        
        {/* Mobile view: Bottom Drawer trigger */}
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="default"
              size="sm" 
              className="fixed bottom-4 right-4 z-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md md:hidden"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Page
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

export default BuilderContent;
