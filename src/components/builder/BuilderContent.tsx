
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
    <div className="flex-1 bg-slate-100 overflow-auto">
      <BuilderCanvas isPreviewMode={isPreviewMode} isLiveSite={isLiveSite} />
    </div>
  );
};

export default React.memo(BuilderContent);
