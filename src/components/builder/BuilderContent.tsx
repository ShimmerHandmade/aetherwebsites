
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import BuilderCanvas from "@/components/builder/canvas";
import PageEditorSidebar from "./PageEditorSidebar";
import { PreviewModeProps } from "./BuilderLayout";

const BuilderContent: React.FC<PreviewModeProps> = ({ isPreviewMode = false }) => {
  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-white overflow-auto">
        <BuilderCanvas isPreviewMode={true} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex">
      <ResizablePanelGroup direction="horizontal">
        {/* Left sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white border-r border-gray-200">
          <PageEditorSidebar isPreviewMode={isPreviewMode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Canvas area */}
        <ResizablePanel defaultSize={80}>
          <div className="p-4 h-full overflow-auto">
            <BuilderCanvas isPreviewMode={false} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default BuilderContent;
