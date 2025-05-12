
import React, { useState, useRef } from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Play, Upload, Pause } from "lucide-react";

interface ElementProps {
  element: BuilderElement;
}

const VideoElement: React.FC<ElementProps> = ({ element }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  return (
    <div className="p-4">
      {element.props?.src ? (
        <div 
          className="relative rounded-lg overflow-hidden shadow-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <video 
            ref={videoRef}
            src={element.props.src} 
            poster={element.props.poster}
            controls={element.props.controls !== false}
            autoPlay={element.props.autoplay}
            muted={element.props.muted || element.props.autoplay}
            loop={element.props.loop}
            className="w-full rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>
          {!element.props.controls && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={handlePlayClick}
            >
              <div className={`bg-black/40 p-3 rounded-full transition-all ${isHovering ? 'scale-110 bg-black/60' : 'scale-100'}`}>
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 aspect-video flex flex-col items-center justify-center rounded-lg shadow-inner border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-gray-700 font-medium">Add Video</span>
          <span className="text-xs text-gray-500 mt-1">Upload or set video URL in properties</span>
          <div className="mt-4">
            <label className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded cursor-pointer transition-colors">
              Upload Video
              <input 
                type="file" 
                className="hidden" 
                accept="video/*"
                onChange={() => {
                  // In a real implementation, this would handle file upload
                  // For now we'll simulate by setting a placeholder video
                  console.log("Video upload functionality would go here");
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoElement;
