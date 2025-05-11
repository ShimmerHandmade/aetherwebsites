
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelLeft, Pencil, LayoutGrid, Settings, ShoppingBag } from "lucide-react";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  const [editorView, setEditorView] = useState<"inline" | "popup">("inline");
  const [activeTab, setActiveTab] = useState("elements");

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-white overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTabContent = () => {
    return (
      <div className="w-full h-full">
        <PageEditorSidebar isPreviewMode={isPreviewMode} />
      </div>
    );
  };

  // Squarespace-style inline editor with resizable panels
  if (editorView === "inline") {
    return (
      <div className="flex-1 bg-gray-100 overflow-hidden flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Left sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white border-r border-gray-200">
            <PageEditorSidebar isPreviewMode={isPreviewMode} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Canvas area */}
          <ResizablePanel defaultSize={80}>
            <div className="p-4 h-full overflow-auto relative">
              <BuilderCanvas isPreviewMode={false} />
              
              {/* Floating button to switch to popup mode */}
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute bottom-4 right-4 z-10 bg-white shadow-md"
                onClick={() => setEditorView("popup")}
              >
                <PanelLeft className="mr-2 h-4 w-4" />
                Switch to Popup Editor
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // Squarespace-style popup editor
  return (
    <div className="flex-1 bg-white overflow-auto relative">
      <BuilderCanvas isPreviewMode={false} />
      
      {/* Desktop view: Side Sheet for editor */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed bottom-4 right-4 z-10 bg-white shadow-md hidden md:flex"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Page
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
          <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-4 mx-4 mt-2">
                <TabsTrigger value="elements">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Elements</span>
                </TabsTrigger>
                <TabsTrigger value="properties">
                  <Pencil className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Properties</span>
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Page</span>
                </TabsTrigger>
                <TabsTrigger value="products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Products</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                {renderTabContent()}
              </div>
            </Tabs>
            
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full" 
                onClick={() => setEditorView("inline")}
              >
                Switch to Inline Editor
              </Button>
            </div>
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
            <Pencil className="mr-2 h-4 w-4" />
            Edit Page
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh]">
          <div className="px-4 pt-4 pb-8">
            <PageEditorSidebar isPreviewMode={isPreviewMode} />
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full mt-4"
              onClick={() => setEditorView("inline")}
            >
              Switch to Inline Editor
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default BuilderContent;
