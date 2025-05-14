
import React from "react";
import { BuilderElement } from "@/contexts/builder/types";
import FeatureElement from "./FeatureElement";
import TestimonialElement from "./TestimonialElement";
import ContactElement from "./ContactElement";
import PricingElement from "./PricingElement";
import CtaElement from "./CtaElement";
import CardElement from "./CardElement";
import FaqElement from "./FaqElement";
import ProductsList from './ProductsList';

export const renderComplexElement = (element: BuilderElement): React.ReactNode => {
  switch (element.type) {
    case "feature":
      return <FeatureElement element={element} />;
    case "testimonial":
      return <TestimonialElement element={element} />;
    case "contact":
      return <ContactElement element={element} />;
    case "pricing":
      return <PricingElement element={element} />;
    case "cta":
      return <CtaElement element={element} />;
    case "card":
      return <CardElement element={element} />;
    case "faq":
      return <FaqElement element={element} />;
    case "productsList":
      return <ProductsList element={element} />;
    default:
      return null;
  }
};

export * from "./FeatureElement";
export * from "./TestimonialElement";
export * from "./ContactElement";
export * from "./PricingElement";
export * from "./CtaElement";
export * from "./CardElement";
export * from "./FaqElement";
export { default as ProductsList } from './ProductsList';
