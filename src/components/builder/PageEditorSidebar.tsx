import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageEditorSidebarProps {
  isPreviewMode: boolean;
}

// This component is now deprecated in favor of the new BuilderSidebar
// Keeping it for backward compatibility but redirecting to new implementation
const PageEditorSidebar: React.FC<PageEditorSidebarProps> = ({ isPreviewMode }) => {
  if (isPreviewMode) return null;

  return (
    <div className="h-full flex items-center justify-center p-4">
      <p className="text-gray-500 text-sm">
        This sidebar has been replaced by the new unified builder sidebar.
      </p>
    </div>
  );
};

export default PageEditorSidebar;
