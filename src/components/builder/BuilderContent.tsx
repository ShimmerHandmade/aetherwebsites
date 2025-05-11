
import React from "react";
import BuilderCanvas from "@/components/builder/BuilderCanvas";
import ElementPalette from "@/components/builder/ElementPalette";
import ElementProperties from "@/components/builder/ElementProperties";

const BuilderContent: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-100 overflow-auto flex">
      {/* Builder sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 p-4 hidden md:block overflow-auto">
        <ElementPalette />
        <ElementProperties />
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 overflow-auto">
        <BuilderCanvas />
      </div>
    </div>
  );
};

export default BuilderContent;
