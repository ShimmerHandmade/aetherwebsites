
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const MenuElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <ul className="space-y-2">
        {(element.props?.items || [{ text: "Item 1", url: "#" }, { text: "Item 2", url: "#" }])
          .map((item: { text: string, url: string }, i: number) => (
          <li key={i}>
            <a href={item.url} className="block p-2 hover:bg-gray-100 rounded">{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuElement;
