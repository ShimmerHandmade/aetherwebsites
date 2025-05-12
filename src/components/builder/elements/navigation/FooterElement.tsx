
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
  const variant = element.props?.variant || "dark";

  // Variants for footer
  const footerStyles = {
    dark: "bg-gray-800 text-gray-200",
    light: "bg-gray-100 text-gray-800",
    brand: "bg-indigo-800 text-gray-200"
  };
  
  // Link styles based on variant
  const linkStyles = {
    dark: "text-gray-400 hover:text-white transition-colors",
    light: "text-gray-600 hover:text-gray-900 transition-colors",
    brand: "text-indigo-200 hover:text-white transition-colors"
  };

  return (
    <footer className={`p-6 ${footerStyles[variant as keyof typeof footerStyles]}`}>
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
                    className={linkStyles[variant as keyof typeof linkStyles]}
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
