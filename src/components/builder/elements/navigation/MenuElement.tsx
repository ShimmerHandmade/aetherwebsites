
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { useNavigate } from "react-router-dom";

interface ElementProps {
  element: BuilderElement;
  isLiveSite?: boolean;
}

const MenuElement: React.FC<ElementProps> = ({ element, isLiveSite = false }) => {
  const navigate = useNavigate();
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    
    // Only use real navigation in live site mode
    if (isLiveSite) {
      if (url.startsWith('/') || url === '#') {
        navigate(url === '#' ? '/' : url);
      } else if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        navigate(url);
      }
    }
    // In builder mode, we prevent default navigation
  };
  
  return (
    <div className="p-4">
      <ul className="space-y-2">
        {(element.props?.items || [{ text: "Item 1", url: "#" }, { text: "Item 2", url: "#" }])
          .map((item: { text: string, url: string }, i: number) => (
          <li key={i}>
            <a 
              href={item.url} 
              className="block p-2 hover:bg-gray-100 rounded"
              onClick={(e) => handleLinkClick(e, item.url)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuElement;
