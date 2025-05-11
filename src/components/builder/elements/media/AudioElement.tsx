
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const AudioElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      {element.props?.src ? (
        <audio 
          src={element.props.src} 
          controls={element.props.controls !== false}
          className="w-full"
        ></audio>
      ) : (
        <div className="bg-gray-200 p-4 flex items-center justify-center">
          <span className="text-gray-500">Audio player placeholder</span>
        </div>
      )}
    </div>
  );
};

export default AudioElement;
