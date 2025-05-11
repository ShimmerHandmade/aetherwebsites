
import React, { useState } from "react";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Edit, PanelLeft } from "lucide-react";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-white overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-auto relative">
      <BuilderCanvas isPreviewMode={false} />
      
      {/* Desktop view: Side Sheet for editor */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed bottom-4 right-4 z-10 bg-white shadow-md hidden md:flex"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Page
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0">
          <div className="h-full">
            <PageEditorSidebar isPreviewMode={isPreviewMode} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Mobile view: Bottom Drawer */}
      <Drawer>
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
    </div>
  );
};

export default BuilderContent;
