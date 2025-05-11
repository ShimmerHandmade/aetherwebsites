
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const NavbarElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-4 bg-white border-b flex justify-between items-center">
      <div className="font-bold">Logo</div>
      <nav>
        <ul className="flex space-x-4">
          {(element.props?.links || [{ text: "Home", url: "#" }, { text: "About", url: "#" }])
            .map((link: { text: string, url: string }, i: number) => (
            <li key={i}>
              <a href={link.url} className="hover:text-indigo-600">{link.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavbarElement;
