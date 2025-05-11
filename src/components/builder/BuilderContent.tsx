
import React from "react";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import ElementPalette from "@/components/builder/ElementPalette";
import ElementProperties from "@/components/builder/ElementProperties";

interface BuilderContentProps {
  isPreviewMode?: boolean;
}

const BuilderContent: React.FC<BuilderContentProps> = ({ isPreviewMode = false }) => {
  return (
    <div className={`flex-1 ${isPreviewMode ? 'bg-white' : 'bg-gray-100'} overflow-auto flex`}>
      {/* Builder sidebar - hidden in preview mode */}
      {!isPreviewMode && (
        <div className="w-60 bg-white border-r border-gray-200 p-4 hidden md:block overflow-auto">
          <ElementPalette />
          <ElementProperties />
        </div>
      )}

      {/* Canvas */}
      <div className={`flex-1 ${isPreviewMode ? 'p-0' : 'p-4'} overflow-auto`}>
        <BuilderCanvas isPreviewMode={isPreviewMode} />
      </div>
    </div>
  );
};

export default BuilderContent;
