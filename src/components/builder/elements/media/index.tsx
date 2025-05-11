
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import VideoElement from "./VideoElement";
import AudioElement from "./AudioElement";
import CarouselElement from "./CarouselElement";
import GalleryElement from "./GalleryElement";

export const renderMediaElement = (element: BuilderElement): React.ReactNode => {
  switch (element.type) {
    case "video":
      return <VideoElement element={element} />;
    case "audio":
      return <AudioElement element={element} />;
    case "carousel":
      return <CarouselElement element={element} />;
    case "gallery":
      return <GalleryElement element={element} />;
    default:
      return null;
  }
};

export * from "./VideoElement";
export * from "./AudioElement";
export * from "./CarouselElement";
export * from "./GalleryElement";
