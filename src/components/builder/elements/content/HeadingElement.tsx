
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const HeadingElement: React.FC<ElementProps> = ({ element }) => {
  const HeadingTag = (element.props?.level || 'h2') as keyof JSX.IntrinsicElements;
  
  return (
    <div className="p-4">
      <HeadingTag className={
        HeadingTag === 'h1' ? 'text-3xl font-bold' :
        HeadingTag === 'h2' ? 'text-2xl font-bold' :
        HeadingTag === 'h3' ? 'text-xl font-bold' :
        HeadingTag === 'h4' ? 'text-lg font-bold' :
        'text-base font-bold'
      }>
        {element.content || `${HeadingTag.toUpperCase()} Heading`}
      </HeadingTag>
    </div>
  );
};

export default HeadingElement;
