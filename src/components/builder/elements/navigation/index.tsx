
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import NavbarElement from "./NavbarElement";
import MenuElement from "./MenuElement";
import FooterElement from "./FooterElement";
import BreadcrumbsElement from "./BreadcrumbsElement";

export const renderNavigationElement = (element: BuilderElement): React.ReactNode => {
  switch (element.type) {
    case "navbar":
      return <NavbarElement element={element} />;
    case "menu":
      return <MenuElement element={element} />;
    case "footer":
      return <FooterElement element={element} />;
    case "breadcrumbs":
      return <BreadcrumbsElement element={element} />;
    default:
      return null;
  }
};

export * from "./NavbarElement";
export * from "./MenuElement";
export * from "./FooterElement";
export * from "./BreadcrumbsElement";
