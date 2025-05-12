
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const NavbarElement: React.FC<ElementProps> = ({ element }) => {
  const siteName = element.props?.siteName || "Your Website";
  const logo = element.props?.logo || "";
  const links = element.props?.links || [
    { text: "Home", url: "#" },
    { text: "About", url: "#" },
    { text: "Services", url: "#" },
    { text: "Contact", url: "#" }
  ];
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {logo ? (
              <img src={logo} alt={`${siteName} logo`} className="h-8" />
            ) : (
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                {siteName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold">{siteName}</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="md:hidden">
            <button 
              className="p-2 text-gray-600"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarElement;
