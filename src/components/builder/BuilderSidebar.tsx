
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Plus,
  Layers,
  Settings,
  Eye,
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  Package,
  Palette
} from "lucide-react";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import LayersPanel from "./LayersPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWebsite } from "@/hooks/useWebsite";

interface BuilderSidebarProps {
  isPreviewMode: boolean;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ isPreviewMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { websiteName } = useWebsite(id, navigate);

  if (isPreviewMode) return null;

  const menuItems = [
    {
      title: "Pages",
      url: `/builder/${id}/pages`,
      icon: FileText,
      badge: null,
    },
    {
      title: "Theme Editor",
      url: `/builder/${id}/theme`,
      icon: Palette,
      badge: "New",
    },
    {
      title: "Products",
      url: `/builder/${id}/products`,
      icon: ShoppingBag,
      badge: null,
    },
    {
      title: "Orders",
      url: `/builder/${id}/orders`,
      icon: Package,
      badge: null,
    },
    {
      title: "Payment Settings",
      url: `/builder/${id}/payment`,
      icon: CreditCard,
      badge: null,
    },
    {
      title: "Shipping Settings",
      url: `/builder/${id}/shipping`,
      icon: Truck,
      badge: null,
    },
    {
      title: "Site Settings",
      url: `/builder/${id}/settings`,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">{websiteName || "Website Builder"}</h2>
            <p className="text-xs text-gray-500">Design & Build</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="elements" className="h-full flex flex-col">
          <div className="px-4 py-2 border-b">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="elements" className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">
                <Layers className="h-3 w-3 mr-1" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="elements" className="mt-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <ElementPalette />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="layers" className="mt-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <LayersPanel />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="properties" className="mt-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <ElementProperties />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </SidebarContent>

      <SidebarFooter className="p-0 border-t">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs text-gray-500">
            Website Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      onClick={() => navigate(item.url)}
                      className="flex items-center gap-3 cursor-pointer w-full"
                    >
                      <item.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye className="h-3 w-3" />
            <span>Live Preview Active</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default BuilderSidebar;
