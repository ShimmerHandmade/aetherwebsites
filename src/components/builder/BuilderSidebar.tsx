
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PanelsTopLeft, Layers, Settings as SettingsIcon } from "lucide-react";
import ElementPalette from "./ElementPalette";
import ElementProperties from "./ElementProperties";
import PageEditorSidebar from "./PageEditorSidebar";

interface BuilderSidebarProps {
  isPreviewMode: boolean;
}

const BuilderSidebar = ({ isPreviewMode }: BuilderSidebarProps) => {
  const { state } = useSidebar();

  if (isPreviewMode) {
    return null;
  }

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className="border-r border-gray-200 bg-gradient-to-b from-slate-50 to-white shadow-sm" 
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <PanelsTopLeft className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800">Builder</h2>
              <p className="text-xs text-gray-500">Design your website</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-full bg-white">
        {/* Page Editor Section */}
        <div className="flex-1 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-blue-600" />
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Page Structure</span>
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <PageEditorSidebar isPreviewMode={isPreviewMode} />
          </div>
        </div>
        
        <Separator className="bg-gray-200" />
        
        {/* Element Palette Section */}
        <div className="border-b border-gray-100">
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700">Components</span>
              )}
            </div>
          </div>
          <ElementPalette />
        </div>
        
        <Separator className="bg-gray-200" />
        
        {/* Element Properties Section */}
        <div className="flex-1 min-h-0">
          <div className="p-3 border-b border-gray-50 bg-gray-25">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-purple-600" />
              {!isCollapsed && (
                <span className="text-sm font-medium text-gray-700">Properties</span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ElementProperties />
          </div>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 p-3 bg-gray-50">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Drag & drop to build
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default BuilderSidebar;
