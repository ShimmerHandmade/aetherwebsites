
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
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

  return (
    <Sidebar className="border-r border-gray-200 bg-white" collapsible="icon">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {state === "collapsed" ? "B" : "Builder"}
        </h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <PageEditorSidebar isPreviewMode={isPreviewMode} />
        </div>
        <div className="border-t border-gray-200">
          <ElementPalette />
        </div>
        <div className="border-t border-gray-200">
          <ElementProperties />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default BuilderSidebar;
