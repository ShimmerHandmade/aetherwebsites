
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold gradient-text">
            ModernBuilder
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
          <Button variant="outline" className="border-gray-300">
            Login
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 absolute w-full animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-brand-600 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-gray-600 hover:text-brand-600 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-600 hover:text-brand-600 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#faq" 
              className="text-gray-600 hover:text-brand-600 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
              <Button variant="outline" className="w-full justify-center">
                Login
              </Button>
              <Button className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
