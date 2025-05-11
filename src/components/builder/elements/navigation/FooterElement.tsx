
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FooterElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-6 bg-gray-800 text-gray-200">
      <div className="text-center">
        <h3 className="mb-4">{element.content || "Website Footer"}</h3>
        <p className="text-sm">© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};

export default FooterElement;
