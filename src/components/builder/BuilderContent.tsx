
import React, { useState } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight, Edit, PanelLeft, Plus } from "lucide-react";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-white overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Left sidebar - visible on desktop */}
      <div className="hidden md:block w-[60px] bg-gray-900">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-white overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} />
        
        {/* Desktop view: Side panel for editor */}
        <div 
          className={`hidden md:block fixed top-[60px] bottom-0 right-0 w-[400px] transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } shadow-lg z-10`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute top-4 -left-8 bg-white border border-gray-200 rounded-l-md rounded-r-none h-16 px-1 ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <PageEditorSidebar isPreviewMode={isPreviewMode} />
        </div>
        
        {/* Add Block button (Squarespace-style) */}
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed left-24 top-40 z-10 bg-white shadow-md rounded-full h-12 w-12 p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Add Section buttons (Squarespace-style) */}
        <div className="w-full flex justify-center">
          <Button 
            variant="default" 
            className="fixed top-60 z-10 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
          >
            ADD SECTION
          </Button>
        </div>
        
        <div className="w-full flex justify-center">
          <Button 
            variant="default" 
            className="fixed bottom-8 z-10 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
          >
            ADD SECTION
          </Button>
        </div>
        
        {/* Mobile view: Bottom Drawer trigger */}
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="outline"
              size="sm" 
              className="fixed bottom-4 right-4 z-10 bg-white shadow-md md:hidden"
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

        {/* Floating contextual edit menu (Squarespace-style) */}
        <div className="hidden group-hover:flex fixed right-4 top-1/3 z-10 bg-white shadow-lg rounded-md overflow-hidden">
          <div className="flex flex-col">
            <Button variant="ghost" className="justify-start px-4 py-2 text-sm font-normal">
              <Edit className="h-4 w-4 mr-2" /> EDIT SECTION
            </Button>
            <Button variant="ghost" className="justify-start px-4 py-2 text-sm font-normal">
              VIEW LAYOUTS
            </Button>
            <Button variant="ghost" className="justify-start px-4 py-2 text-sm text-red-600 font-normal">
              REMOVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderContent;
