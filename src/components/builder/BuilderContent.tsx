
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import BuilderCanvas from "@/components/builder/canvas";
import ElementPalette from "@/components/builder/ElementPalette";
import ElementProperties from "@/components/builder/ElementProperties";
import { PreviewModeProps } from "./BuilderLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-white overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex">
      <ResizablePanelGroup direction="horizontal">
        {/* Left sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white border-r border-gray-200">
          <Tabs defaultValue="elements" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 mt-2">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="elements" className="flex-1 overflow-auto p-4">
              <ElementPalette />
            </TabsContent>
            <TabsContent value="properties" className="flex-1 overflow-auto p-4">
              <ElementProperties />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Canvas area */}
        <ResizablePanel defaultSize={80}>
          <div className="p-4 h-full overflow-auto">
            <BuilderCanvas isPreviewMode={false} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default BuilderContent;
