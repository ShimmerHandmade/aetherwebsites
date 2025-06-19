
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Plus, 
  Settings, 
  Smartphone,
  X,
  Type,
  Image,
  Square,
  Layout
} from "lucide-react";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { v4 as uuidv4 } from "@/lib/uuid";

interface MobileBuilderSidebarProps {
  isPreviewMode: boolean;
}

const MobileBuilderSidebar: React.FC<MobileBuilderSidebarProps> = ({ 
  isPreviewMode 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("elements");
  const { addElement } = useBuilder();

  if (isPreviewMode) return null;

  // Quick add element functions for the floating buttons
  const quickAddText = () => {
    const newElement = {
      id: uuidv4(),
      type: "text",
      content: "Your text here...",
      props: { className: "text-gray-600" }
    };
    addElement(newElement);
    setIsOpen(false);
  };

  const quickAddImage = () => {
    const newElement = {
      id: uuidv4(),
      type: "image",
      content: "",
      props: { 
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", 
        alt: "Placeholder image",
        className: "w-full h-auto"
      }
    };
    addElement(newElement);
    setIsOpen(false);
  };

  const quickAddButton = () => {
    const newElement = {
      id: uuidv4(),
      type: "button",
      content: "Click me",
      props: { variant: "primary", size: "default" }
    };
    addElement(newElement);
    setIsOpen(false);
  };

  const quickAddSection = () => {
    const newElement = {
      id: uuidv4(),
      type: "section",
      content: "",
      props: { padding: "large", backgroundColor: "bg-white" }
    };
    addElement(newElement);
    setIsOpen(false);
  };

  return (
    <>
      {/* Main floating action button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full h-16 w-16 shadow-xl bg-blue-600 hover:bg-blue-700 border-2 border-white"
            >
              <Plus className="h-7 w-7 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[85vh] bg-white border-t rounded-t-xl p-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                  Builder Tools
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-3 h-12">
                  <TabsTrigger value="elements" className="flex items-center gap-2 text-base">
                    <Plus className="h-5 w-5" />
                    Elements
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="flex items-center gap-2 text-base">
                    <Settings className="h-5 w-5" />
                    Properties
                  </TabsTrigger>
                </TabsList>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="elements" className="h-full mt-3">
                    <ScrollArea className="h-full px-4">
                      <ElementPalette />
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="properties" className="h-full mt-3">
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

      {/* Quick access floating buttons */}
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <div className="flex flex-col gap-3">
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-blue-300"
            title="Add Text"
            onClick={quickAddText}
          >
            <Type className="h-6 w-6 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-blue-300"
            title="Add Image"
            onClick={quickAddImage}
          >
            <Image className="h-6 w-6 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-blue-300"
            title="Add Button"
            onClick={quickAddButton}
          >
            <Square className="h-6 w-6 text-gray-700" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-blue-300"
            title="Add Section"
            onClick={quickAddSection}
          >
            <Layout className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileBuilderSidebar;
