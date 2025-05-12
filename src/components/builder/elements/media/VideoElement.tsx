
import React, { useState } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Play, Upload } from "lucide-react";

interface ElementProps {
  element: BuilderElement;
}

const VideoElement: React.FC<ElementProps> = ({ element }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="p-4">
      {element.props?.src ? (
        <div 
          className="relative rounded-lg overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className={`bg-black/30 p-3 rounded-full transition-transform ${isHovering ? 'scale-110' : 'scale-100'}`}>
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 aspect-video flex flex-col items-center justify-center rounded-lg shadow-inner border-2 border-dashed border-gray-300">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-gray-700 font-medium">Add Video</span>
          <span className="text-xs text-gray-500 mt-1">Upload or set video URL in properties</span>
        </div>
      )}
    </div>
  );
};

export default VideoElement;
