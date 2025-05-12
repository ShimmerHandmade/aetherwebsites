
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
    brand: "bg-indigo-800 text-gray-200",
    simple: "bg-white border-t border-gray-200 text-gray-700"
  };
  
  // Link styles based on variant
  const linkStyles = {
    dark: "text-gray-400 hover:text-white transition-colors",
    light: "text-gray-600 hover:text-gray-900 transition-colors",
    brand: "text-indigo-200 hover:text-white transition-colors",
    simple: "text-gray-500 hover:text-gray-700 transition-colors"
  };

  return (
    <footer className={`py-6 ${footerStyles[variant as keyof typeof footerStyles]}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-6 h-6 ${
                variant === 'dark' || variant === 'brand' ? 'bg-white text-gray-800' : 'bg-indigo-600 text-white'
              } rounded flex items-center justify-center text-xs font-bold`}>
                {siteName.charAt(0)}
              </div>
              <h3 className="text-lg font-bold">{siteName}</h3>
            </div>
            <p className="text-sm mt-1">© {year} {siteName}. All rights reserved.</p>
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
