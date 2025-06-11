
import React from "react";
import BuilderCanvas from "@/components/builder/canvas";

interface BuilderContentProps {
  isPreviewMode?: boolean;
  isLiveSite?: boolean;
}

const BuilderContent: React.FC<BuilderContentProps> = ({ 
  isPreviewMode = false,
  isLiveSite = false
}) => {
  return (
    <div className="flex-1 bg-slate-50 h-full relative overflow-hidden">
      <div className="absolute inset-0 p-4 pb-20">
        <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto">
          <BuilderCanvas isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(BuilderContent);
