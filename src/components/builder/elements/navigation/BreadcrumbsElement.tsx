
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const BreadcrumbsElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4">
      <nav className="text-sm">
        <ol className="flex">
          {(element.props?.items || [{ text: "Home", url: "#" }, { text: "Section", url: "#" }])
            .map((item: { text: string, url: string }, i: number, arr: any[]) => (
            <li key={i} className="flex items-center">
              <a href={item.url} className="hover:text-indigo-600">{item.text}</a>
              {i < arr.length - 1 && <span className="mx-2 text-gray-400">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbsElement;
