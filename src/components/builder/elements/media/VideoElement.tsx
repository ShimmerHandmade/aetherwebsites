
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Play, Upload } from "lucide-react";

interface ElementProps {
  element: BuilderElement;
}

const VideoElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      {element.props?.src ? (
        <div className="relative">
          <video 
            src={element.props.src} 
            poster={element.props.poster}
            controls={element.props.controls !== false}
            autoPlay={element.props.autoplay}
            muted={element.props.muted || element.props.autoplay}
            loop={element.props.loop}
            className="w-full rounded-lg shadow-md"
          ></video>
          {!element.props.controls && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 p-3 rounded-full">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-200 aspect-video flex flex-col items-center justify-center rounded-lg shadow-inner">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-gray-500 font-medium">Video placeholder</span>
          <span className="text-xs text-gray-400 mt-1">Upload or set video URL in properties</span>
        </div>
      )}
    </div>
  );
};

export default VideoElement;
