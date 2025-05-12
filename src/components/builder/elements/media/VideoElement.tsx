
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const VideoElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      {element.props?.src ? (
        <video 
          src={element.props.src} 
          poster={element.props.poster}
          controls={element.props.controls !== false}
          autoPlay={element.props.autoplay}
          muted={element.props.autoplay}
          loop={element.props.loop}
          className="w-full rounded-lg"
        ></video>
      ) : (
        <div className="bg-gray-200 aspect-video flex items-center justify-center">
          <span className="text-gray-500">Video placeholder</span>
        </div>
      )}
    </div>
  );
};

export default VideoElement;
