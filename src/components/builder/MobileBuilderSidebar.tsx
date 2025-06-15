
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Plus, 
  Settings, 
  Smartphone,
  X
} from "lucide-react";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";

interface MobileBuilderSidebarProps {
  isPreviewMode: boolean;
}

const MobileBuilderSidebar: React.FC<MobileBuilderSidebarProps> = ({ 
  isPreviewMode 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("elements");

  if (isPreviewMode) return null;

  return (
    <>
      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[80vh] bg-white border-t rounded-t-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Builder
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
                  <TabsTrigger value="elements" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Elements</span>
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Properties</span>
                  </TabsTrigger>
                </TabsList>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="elements" className="h-full mt-2">
                    <ScrollArea className="h-full px-4">
                      <ElementPalette />
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="properties" className="h-full mt-2">
                    <ScrollArea className="h-full px-4">
                      <ElementProperties />
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Quick access toolbar for frequently used elements */}
      <div className="fixed bottom-20 right-6 z-40 md:hidden">
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full bg-white shadow-md"
            title="Add Text"
          >
            T
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full bg-white shadow-md"
            title="Add Image"
          >
            📷
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full bg-white shadow-md"
            title="Add Button"
          >
            🔘
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileBuilderSidebar;
