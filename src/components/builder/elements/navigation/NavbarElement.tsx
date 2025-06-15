import React, { useState, useEffect } from "react";
import { BuilderElement } from "@/contexts/builder/types";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CartButton from "@/components/CartButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Extra props for builder edit/preview mode
 * If forceMobileView is true, always use mobile nav style (for builder preview)
 */
interface BuilderPreviewMobileProps {
  forceMobileView?: boolean;
  isPreviewMode?: boolean;
}

interface ElementProps extends BuilderPreviewMobileProps {
  element: BuilderElement;
  isLiveSite?: boolean;
}

const NavbarElement: React.FC<ElementProps> = ({
  element,
  isLiveSite = false,
  forceMobileView,
  isPreviewMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // This is the magic: use forced mobile view in builder preview, otherwise use actual browser/mobile detection
  const effectiveIsMobile = forceMobileView || isMobile;
  
  const siteName = element.props?.siteName || "Your Website";
  const showCartButton = element.props?.showCartButton !== false;
  const logo = element.props?.logo || 
               (typeof window !== 'undefined' && 
                window.__SITE_SETTINGS__?.logoUrl) || 
               "";
  const links = element.props?.links || [
    { text: "Home", url: "#" },
    { text: "About", url: "#" },
    { text: "Services", url: "#" },
    { text: "Contact", url: "#" }
  ];
  const variant = element.props?.variant || "default";
  const navbarStyles = {
    default: "bg-white shadow-sm border-b border-gray-200",
    transparent: "bg-transparent",
    dark: "bg-gray-900 text-white",
    primary: "bg-indigo-600 text-white",
    accent: "bg-amber-500 text-white"
  };
  const linkStyles = {
    default: "text-gray-600 hover:text-indigo-600 transition-colors font-medium",
    transparent: "text-gray-800 hover:text-indigo-600 transition-colors font-medium",
    dark: "text-gray-300 hover:text-white transition-colors font-medium",
    primary: "text-white/80 hover:text-white transition-colors font-medium",
    accent: "text-white/90 hover:text-white transition-colors font-medium"
  };
  const mobileLinkStyles = {
    default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium",
    transparent: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium",
    dark: "text-gray-800 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium",
    primary: "text-gray-800 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium",
    accent: "text-gray-800 hover:text-amber-600 hover:bg-gray-50 transition-colors font-medium"
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => setMobileMenuOpen(open => !open);

  // Close menu when switching to desktop-like view, builder or real
  useEffect(() => {
    if (!effectiveIsMobile && mobileMenuOpen) setMobileMenuOpen(false);
  }, [effectiveIsMobile, mobileMenuOpen]);

  // Prevent body scroll if mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Get the current site URL to build site-specific cart URL
  const getSiteCartUrl = () => {
    const currentPath = location.pathname;    
    if (currentPath.includes('/site/')) {
      const siteIdMatch = currentPath.match(/\/site\/([^\/]+)/);
      if (siteIdMatch) {
        const siteId = siteIdMatch[1];
        return `/site/${siteId}/cart`;
      }
    }
    if (currentPath.includes('/view/')) {
      const siteIdMatch = currentPath.match(/\/view\/([^\/]+)/);
      if (siteIdMatch) {
        const siteId = siteIdMatch[1];
        return `/view/${siteId}/cart`;
      }
    }
    if (typeof window !== 'undefined' && window.__SITE_SETTINGS__?.siteId) {
      const siteId = window.__SITE_SETTINGS__.siteId;
      if (currentPath.includes('/view/') || window.__SITE_SETTINGS__.isLiveSite) {
        return `/view/${siteId}/cart`;
      }
      return `/site/${siteId}/cart`;
    }
    return '/cart';
  };

  // Handle link clicks with proper navigation in both live site and builder previews (edit mode)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();

    // Always support navigation in both builder and live preview
    if (url.startsWith('/') || url === '#') {
      navigate(url === '#' ? '/' : url);
    } else if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={cn(navbarStyles[variant as keyof typeof navbarStyles], "relative z-50")}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {logo ? (
                <img 
                  src={logo} 
                  alt={`${siteName} logo`} 
                  className="h-6 sm:h-8 object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center text-white font-bold text-sm",
                  variant === 'default' || variant === 'transparent' ? 'bg-indigo-600' : 'bg-white/20'
                )}>
                  {siteName.charAt(0)}
                </div>
              )}
              <span className={cn(
                "text-sm sm:text-lg font-bold", 
                variant === 'dark' || variant === 'primary' || variant === 'accent' ? 'text-white' : 'text-gray-800'
              )}>
                {siteName}
              </span>
            </div>
            
            {/* Only show desktop nav on "real" desktop (not simulated) */}
            <nav className={cn("hidden md:block", effectiveIsMobile ? "hidden" : "")}>
              <ul className="flex space-x-6 lg:space-x-8">
                {links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      className={linkStyles[variant as keyof typeof linkStyles]}
                      onClick={(e) => handleLinkClick(e, link.url)}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="flex items-center space-x-2">
              {showCartButton && (
                <CartButton 
                  variant={variant === 'dark' || variant === 'primary' || variant === 'accent' ? "ghost" : "outline"} 
                  size="icon" 
                  className="text-inherit" 
                  siteCartUrl={getSiteCartUrl()}
                />
              )}
              {/* Always show mobile menu button in simulated or real mobile */}
              <div className={cn("md:hidden", effectiveIsMobile ? "" : "hidden")}>
                <button 
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    variant === 'dark' || variant === 'primary' || variant === 'accent' ? 
                      'text-white/80 hover:bg-white/10 hover:text-white' : 
                      'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  onClick={toggleMobileMenu}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && effectiveIsMobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg animate-slide-in-right">
            <div className="p-6 pt-20">
              <div className="flex flex-col space-y-6">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className={cn(
                      mobileLinkStyles[variant as keyof typeof mobileLinkStyles],
                      "py-3 px-4 text-lg rounded-md block"
                    )}
                    onClick={(e) => handleLinkClick(e, link.url)}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarElement;
