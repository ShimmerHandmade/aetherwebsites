
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import TextElement from "./TextElement";
import HeadingElement from "./HeadingElement";
import ImageElement from "./ImageElement";
import ButtonElement from "./ButtonElement";
import ListElement from "./ListElement";
import IconElement from "./IconElement";

export const renderContentElement = (element: BuilderElement): React.ReactNode => {
  switch (element.type) {
    case "text":
      return <TextElement element={element} />;
    case "heading":
      return <HeadingElement element={element} />;
    case "image":
      return <ImageElement element={element} />;
    case "button":
      return <ButtonElement element={element} />;
    case "list":
      return <ListElement element={element} />;
    case "icon":
      return <IconElement element={element} />;
    default:
      return null;
  }
};

export * from "./TextElement";
export * from "./HeadingElement";
export * from "./ImageElement";
export * from "./ButtonElement";
export * from "./ListElement";
export * from "./IconElement";
