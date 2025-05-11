
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import FormElement from "./FormElement";
import InputElement from "./InputElement";
import TextareaElement from "./TextareaElement";
import CheckboxElement from "./CheckboxElement";
import SelectElement from "./SelectElement";

export const renderInteractiveElement = (element: BuilderElement): React.ReactNode => {
  switch (element.type) {
    case "form":
      return <FormElement element={element} />;
    case "input":
      return <InputElement element={element} />;
    case "textarea":
      return <TextareaElement element={element} />;
    case "checkbox":
      return <CheckboxElement element={element} />;
    case "select":
      return <SelectElement element={element} />;
    default:
      return null;
  }
};

export * from "./FormElement";
export * from "./InputElement";
export * from "./TextareaElement";
export * from "./CheckboxElement";
export * from "./SelectElement";
