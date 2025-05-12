
import React, { useState } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight, Edit, Plus } from "lucide-react";

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
      {/* Left sidebar - visible on desktop - width increased */}
      <div className="hidden md:block w-[220px] bg-white border-r border-slate-200">
        {/* This space is for the vertical sidebar managed by PageEditorSidebar */}
        <PageEditorSidebar isPreviewMode={isPreviewMode} />
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-slate-100 overflow-auto relative">
        <BuilderCanvas isPreviewMode={false} />
        
        {/* Add Section/Block button - inspired by Squarespace */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg px-6"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            ADD SECTION
          </Button>
        </div>
        
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
