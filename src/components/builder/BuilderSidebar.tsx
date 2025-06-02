
import React, { useState } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageSettings from "./PageSettings";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, Settings, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuilderSidebarProps {
  isPreviewMode: boolean;
}

const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ isPreviewMode }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedElementId } = useBuilder();

  if (isPreviewMode) return null;

  const tabs = [
    {
      id: "elements",
      name: "Elements",
      icon: LayoutGrid,
      component: <ElementPalette />,
    },
    {
      id: "properties",
      name: "Properties",
      icon: Edit,
      component: <ElementProperties />,
      disabled: !selectedElementId,
    },
    {
      id: "settings",
      name: "Page Settings",
      icon: Settings,
      component: <PageSettings />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Builder Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton
                      isActive={activeTab === tab.id}
                      onClick={() => !tab.disabled && setActiveTab(tab.id)}
                      disabled={tab.disabled}
                      className={cn(
                        tab.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1 overflow-hidden">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
