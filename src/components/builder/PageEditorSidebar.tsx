
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageSettings from "./PageSettings";
import ProductManager from "./ProductManager";
import { 
  LayoutGrid, 
  Pencil, 
  Settings, 
  ShoppingBag, 
  FileText, 
  Image,
  Package,
  Users,
  CreditCard,
  Palette,
  Layers,
  BarChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PageEditorSidebarProps {
  isPreviewMode: boolean;
}

const PageEditorSidebar: React.FC<PageEditorSidebarProps> = ({ isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");

  if (isPreviewMode) return null;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="py-4 px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Editor</h2>
      </div>

      <Tabs 
        defaultValue="elements" 
        className="h-full flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="border-b border-gray-200 bg-white">
          <TabsList className="flex w-full justify-start space-x-2 bg-transparent p-0">
            <TabsTrigger 
              value="elements" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent",
                activeTab === "elements" ? "border-blue-600 text-blue-600" : "text-gray-600"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Elements</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="properties" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent",
                activeTab === "properties" ? "border-blue-600 text-blue-600" : "text-gray-600"
              )}
            >
              <Pencil className="h-4 w-4" />
              <span>Design</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent",
                activeTab === "settings" ? "border-blue-600 text-blue-600" : "text-gray-600"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Page</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="products" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent",
                activeTab === "products" ? "border-blue-600 text-blue-600" : "text-gray-600"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 overflow-auto">
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

      {/* Squarespace-like navigation sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-[60px] hidden md:flex flex-col items-center pt-16 bg-gray-900 text-white">
        <div className="flex flex-col items-center space-y-6">
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <FileText className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none bg-gray-800">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <Package className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <Palette className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <Layers className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <CreditCard className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="w-full p-3 rounded-none hover:bg-gray-800">
            <BarChart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageEditorSidebar;
