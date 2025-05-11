
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const ListElement: React.FC<ElementProps> = ({ element }) => {
  const listType = element.props?.type === 'numbered' ? 'ol' : 'ul';
  const ListTag = listType as keyof JSX.IntrinsicElements;
  
  return (
    <div className="p-4">
      <ListTag className={listType === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside'}>
        {(element.props?.items || ["Item 1", "Item 2"]).map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
};

export default ListElement;
