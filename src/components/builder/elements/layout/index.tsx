
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import HeaderElement from "./HeaderElement";
import HeroElement from "./HeroElement";
import ContainerElement from "./ContainerElement";
import SectionElement from "./SectionElement";
import GridElement from "./GridElement";
import FlexElement from "./FlexElement";
import SpacerElement from "./SpacerElement";
import DividerElement from "./DividerElement";

export const renderLayoutElement = (
  element: BuilderElement,
  isPreviewMode: boolean = false,
  isLiveSite: boolean = false
): React.ReactNode => {
  switch (element.type) {
    case "header":
      return <HeaderElement element={element} />;
    case "hero":
      return <HeroElement element={element} />;
    case "container":
      return <ContainerElement element={element} />;
    case "section":
      return <SectionElement element={element} />;
    case "grid":
      return <GridElement element={element} />;
    case "flex":
      return <FlexElement element={element} />;
    case "spacer":
      return <SpacerElement element={element} />;
    case "divider":
      return <DividerElement element={element} />;
    default:
      return null;
  }
};

export * from "./HeaderElement";
export * from "./HeroElement";
export * from "./ContainerElement";
export * from "./SectionElement";
export * from "./GridElement";
export * from "./FlexElement";
export * from "./SpacerElement";
export * from "./DividerElement";
