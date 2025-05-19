
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import TextElement from "./TextElement";
import HeadingElement from "./HeadingElement";
import ImageElement from "./ImageElement";
import ButtonElement from "./ButtonElement";
import ListElement from "./ListElement";
import IconElement from "./IconElement";

export const renderContentElement = (
  element: BuilderElement,
  isPreviewMode: boolean = false,
  isLiveSite: boolean = false
): React.ReactNode => {
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

export { default as TextElement } from "./TextElement";
export { default as HeadingElement } from "./HeadingElement";
export { default as ImageElement } from "./ImageElement";
export { default as ButtonElement } from "./ButtonElement";
export { default as ListElement } from "./ListElement";
export { default as IconElement } from "./IconElement";
