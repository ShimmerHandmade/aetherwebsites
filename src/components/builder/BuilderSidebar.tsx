
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import { 
  Settings, 
  Layers, 
  Plus, 
  Palette,
  Crown,
  Sparkles
} from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import ColorSchemeEditor from "./ColorSchemeEditor";

interface BuilderSidebarProps {
  isPreviewMode: boolean;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ isPreviewMode }) => {
  const [colorSchemeDialogOpen, setColorSchemeDialogOpen] = useState(false);
  const { isPremium, checkUpgrade } = usePlan();

  if (isPreviewMode) return null;

  const handleColorSchemeClick = () => {
    if (!isPremium && checkUpgrade) {
      checkUpgrade("Color Scheme Editor");
      return;
    }
    setColorSchemeDialogOpen(true);
  };

  const handleColorSchemeSave = (scheme: any) => {
    console.log("Color scheme saved:", scheme);
    setColorSchemeDialogOpen(false);
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">Website Builder</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="h-full flex flex-col">
          <Tabs defaultValue="elements" className="flex-1 flex flex-col">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-3 text-xs">
                <TabsTrigger value="elements" className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Add
                </TabsTrigger>
                <TabsTrigger value="layers" className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Layers
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Style
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="elements" className="h-full m-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <ElementPalette />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="layers" className="h-full m-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <div className="text-center text-gray-500 text-sm">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Layer management coming soon</p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="h-full m-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <ElementProperties />
                    
                    {/* Color Scheme Editor */}
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Design Tools
                      </h3>
                      
                      <Dialog open={colorSchemeDialogOpen} onOpenChange={setColorSchemeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start gap-2"
                            onClick={handleColorSchemeClick}
                          >
                            <Palette className="h-4 w-4" />
                            Color Scheme Editor
                            {!isPremium && (
                              <Badge className="ml-auto bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Palette className="h-5 w-5" />
                              Color Scheme Editor
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <ColorSchemeEditor 
                            onSave={handleColorSchemeSave}
                            onClose={() => setColorSchemeDialogOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
