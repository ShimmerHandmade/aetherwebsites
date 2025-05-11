
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageSettings from "./PageSettings";
import ProductManager from "./ProductManager";
import { LayoutGrid, Pencil, Settings, ShoppingBag } from "lucide-react";

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
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mx-4 mt-2">
          <TabsTrigger value="elements" className="flex flex-col items-center py-2 px-1">
            <LayoutGrid className="h-4 w-4 mb-1" />
            <span className="text-xs">Elements</span>
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex flex-col items-center py-2 px-1">
            <Pencil className="h-4 w-4 mb-1" />
            <span className="text-xs">Properties</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center py-2 px-1">
            <Settings className="h-4 w-4 mb-1" />
            <span className="text-xs">Page</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex flex-col items-center py-2 px-1">
            <ShoppingBag className="h-4 w-4 mb-1" />
            <span className="text-xs">Products</span>
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1 overflow-auto mt-2">
          <TabsContent value="elements" className="p-4 h-full m-0">
            <ElementPalette />
          </TabsContent>
          
          <TabsContent value="properties" className="p-4 h-full m-0">
            <ElementProperties />
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 h-full m-0">
            <PageSettings />
          </TabsContent>
          
          <TabsContent value="products" className="p-4 h-full m-0">
            <ProductManager />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default PageEditorSidebar;
