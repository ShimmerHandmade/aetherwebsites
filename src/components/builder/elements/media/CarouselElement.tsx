
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const CarouselElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <div className="bg-gray-200 aspect-video flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Image Carousel placeholder</div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselElement;
