
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleStartFreeTrial = () => {
    navigate('/auth');
  };
  
  const handleWatchDemo = () => {
    // This could open a modal or navigate to a demo page
    // For now, let's just log it
    console.log('Watch demo clicked');
  };
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#FCFCFF] -z-10">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up">
              Create your <span className="gradient-text">e-commerce</span> website in minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Build a beautiful online store without any coding skills. ModernBuilder gives you everything you need to launch and grow your business online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-6 px-8"
                onClick={handleStartFreeTrial}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-lg py-6 px-8"
                onClick={handleWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              No credit card required. 14-day free trial.
            </div>
          </div>

          <div className="lg:w-1/2 lg:pl-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl transform -rotate-2"></div>
              <div className="relative bg-white p-4 rounded-xl shadow-xl transform rotate-1 transition-all duration-300 hover:rotate-0 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700" 
                  alt="ModernBuilder Dashboard Preview" 
                  className="rounded-lg w-full"
                />
              </div>
              <div className="absolute right-4 bottom-0 translate-y-1/4 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">JD</div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">AB</div>
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">TM</div>
                  </div>
                  <span className="text-sm font-medium">1,250+ stores launched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
