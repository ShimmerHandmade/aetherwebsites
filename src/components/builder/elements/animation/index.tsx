
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import FadeInElement from "./FadeInElement";
import ScaleInElement from "./ScaleInElement";
import SlideInElement from "./SlideInElement";
import ScrollRevealElement from "./ScrollRevealElement";
import ParticlesBackground from "./ParticlesBackground";

export const renderAnimationElement = (
  element: BuilderElement,
  isPreviewMode: boolean = false,
  isLiveSite: boolean = false
): React.ReactNode => {
  switch (element.type) {
    case "fadeInElement":
      return <FadeInElement element={element} />;
    case "slideInElement":
      return <SlideInElement element={element} />;
    case "scaleInElement":
      return <ScaleInElement element={element} />;
    case "scrollReveal":
      return <ScrollRevealElement element={element} />;
    case "particlesBackground":
      return <ParticlesBackground element={element} />;
    default:
      return null;
  }
};

export * from "./FadeInElement";
export * from "./ScaleInElement";
export * from "./SlideInElement";
export * from "./ScrollRevealElement";
export * from "./ParticlesBackground";
