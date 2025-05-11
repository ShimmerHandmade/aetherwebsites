
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageSettings from "./PageSettings";

interface PageEditorSidebarProps {
  isPreviewMode: boolean;
}

const PageEditorSidebar: React.FC<PageEditorSidebarProps> = ({ isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");

  if (isPreviewMode) return null;

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        defaultValue="elements" 
        className="h-full flex flex-col"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="settings">Page</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 overflow-auto">
          <TabsContent value="elements" className="p-4 h-full">
            <ElementPalette />
          </TabsContent>
          
          <TabsContent value="properties" className="p-4 h-full">
            <ElementProperties />
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 h-full">
            <PageSettings />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default PageEditorSidebar;
