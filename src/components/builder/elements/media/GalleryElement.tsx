
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const GalleryElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-200 aspect-square flex items-center justify-center">
            <span className="text-gray-500">Image {i+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryElement;
