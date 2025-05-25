
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Then check for existing session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-xl md:text-2xl font-bold gradient-text">
              Aether Websites
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-brand-600 transition-colors duration-300">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-brand-600 transition-colors duration-300">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-brand-600 transition-colors duration-300">
              Testimonials
            </a>
            <a href="#faq" className="text-gray-600 hover:text-brand-600 transition-colors duration-300">
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-gray-300"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
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
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-brand-600 transition-colors duration-300 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-600 hover:text-brand-600 transition-colors duration-300 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#testimonials" 
                  className="text-gray-600 hover:text-brand-600 transition-colors duration-300 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a 
                  href="#faq" 
                  className="text-gray-600 hover:text-brand-600 transition-colors duration-300 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  {isAuthenticated ? (
                    <Button 
                      className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600"
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                        onClick={() => {
                          navigate("/auth");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button 
                        className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={() => {
                          navigate("/auth");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
