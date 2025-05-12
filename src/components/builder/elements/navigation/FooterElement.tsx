
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const FooterElement: React.FC<ElementProps> = ({ element }) => {
  const year = new Date().getFullYear();
  const siteName = element.props?.siteName || "Your Website";
  const links = element.props?.links || [
    { text: "Home", url: "#" },
    { text: "About", url: "#" },
    { text: "Services", url: "#" },
    { text: "Contact", url: "#" }
  ];

  return (
    <footer className="p-6 bg-gray-800 text-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{siteName}</h3>
            <p className="text-sm mt-2">© {year} {siteName}. All rights reserved.</p>
          </div>
          
          <nav>
            <ul className="flex flex-wrap gap-6">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default FooterElement;
