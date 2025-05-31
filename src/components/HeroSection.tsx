
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Globe, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    { icon: Globe, text: "Global Reach" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Palette, text: "Beautiful Design" },
    { icon: Sparkles, text: "AI Powered" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => {
          const IconComponent = features[i % features.length].icon;
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">AI-Powered Website Builder</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Build
            </span>
            <br />
            <span className="text-gray-900">Stunning Websites</span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          {/* Animated Feature Text */}
          <div className="mb-8 h-16 flex items-center justify-center">
            <div className="text-xl md:text-2xl text-gray-600 flex items-center gap-3">
              <span>Create websites that are</span>
              <div className="relative">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`absolute left-0 flex items-center gap-2 transition-all duration-500 ${
                        index === currentFeature
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      <FeatureIcon className="w-6 h-6 text-indigo-600" />
                      <span className="font-semibold text-indigo-600">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into professional websites with our advanced AI-powered builder. 
            No coding required, unlimited creativity enabled.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-gray-300 hover:border-indigo-300 px-8 py-4 text-lg font-semibold rounded-full hover:bg-indigo-50 transition-all duration-300"
            >
              See Features
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: "50K+", label: "Websites Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
