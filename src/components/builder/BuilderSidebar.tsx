
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
  Plus, 
  Palette,
  Crown,
  Sparkles
} from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import ColorSchemeEditor from "./ColorSchemeEditor";
import { toast } from "sonner";

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
    
    // Apply the color scheme to CSS variables
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(scheme.primary));
    root.style.setProperty('--secondary', hexToHsl(scheme.secondary));
    root.style.setProperty('--accent', hexToHsl(scheme.accent));
    root.style.setProperty('--background', hexToHsl(scheme.background));
    root.style.setProperty('--card', hexToHsl(scheme.surface));
    root.style.setProperty('--foreground', hexToHsl(scheme.text));
    root.style.setProperty('--muted-foreground', hexToHsl(scheme.textSecondary));
    root.style.setProperty('--border', hexToHsl(scheme.border));
    
    toast.success("Color scheme applied successfully!");
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
              <TabsList className="grid w-full grid-cols-2 text-xs">
                <TabsTrigger value="elements" className="flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Add
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
