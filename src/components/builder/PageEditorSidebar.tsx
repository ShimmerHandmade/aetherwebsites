
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
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageEditorSidebarProps {
  isPreviewMode: boolean;
}

const PageEditorSidebar: React.FC<PageEditorSidebarProps> = ({ isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");

  if (isPreviewMode) return null;

  return (
    <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      <div className="py-5 px-5 border-b border-slate-200">
        <h2 className="text-xl font-medium text-slate-800">Editor</h2>
      </div>

      <Tabs 
        defaultValue="elements" 
        className="h-full flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="border-b border-slate-200 bg-white px-2">
          <TabsList className="flex w-full justify-start gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="elements" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent",
                activeTab === "elements" ? "border-indigo-600 text-indigo-600 font-medium" : "text-slate-600"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Elements</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="properties" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent",
                activeTab === "properties" ? "border-indigo-600 text-indigo-600 font-medium" : "text-slate-600"
              )}
            >
              <Pencil className="h-4 w-4" />
              <span>Properties</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent",
                activeTab === "settings" ? "border-indigo-600 text-indigo-600 font-medium" : "text-slate-600"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Page</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="products" 
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent",
                activeTab === "products" ? "border-indigo-600 text-indigo-600 font-medium" : "text-slate-600"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1 overflow-auto">
          <TabsContent value="elements" className="p-6 h-full m-0">
            <ElementPalette />
          </TabsContent>
          
          <TabsContent value="properties" className="p-6 h-full m-0">
            <ElementProperties />
          </TabsContent>
          
          <TabsContent value="settings" className="p-6 h-full m-0">
            <PageSettings />
          </TabsContent>
          
          <TabsContent value="products" className="p-6 h-full m-0">
            <ProductManager />
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Squarespace-like navigation sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-[60px] hidden md:flex flex-col items-center pt-20 bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-8">
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative">
            <FileText className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Pages</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative bg-slate-800">
            <LayoutGrid className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Page Editor</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative">
            <Image className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Media</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative">
            <Package className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Products</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative">
            <Users className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Customers</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-800 transition-colors group relative">
            <CreditCard className="h-5 w-5" />
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">Payments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditorSidebar;
