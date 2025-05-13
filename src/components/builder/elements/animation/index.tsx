
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import FadeInElement from "./FadeInElement";
import SlideInElement from "./SlideInElement";
import ScaleInElement from "./ScaleInElement";
import ParticlesBackground from "./ParticlesBackground";
import ScrollRevealElement from "./ScrollRevealElement";

export const renderAnimationElement = (element: BuilderElement, isPreviewMode = false): React.ReactNode => {
  switch (element.type) {
    case "fadeInElement":
      return <FadeInElement element={element} />;
    case "slideInElement":
      return <SlideInElement element={element} />;
    case "scaleInElement":
      return <ScaleInElement element={element} />;
    case "particlesBackground":
      return <ParticlesBackground element={element} />;
    case "scrollReveal":
      return <ScrollRevealElement element={element} isPreviewMode={isPreviewMode} />;
    default:
      return null;
  }
};

export * from "./FadeInElement";
export * from "./SlideInElement";
export * from "./ScaleInElement";
export * from "./ParticlesBackground";
export * from "./ScrollRevealElement";
