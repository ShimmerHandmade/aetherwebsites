
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Smartphone, 
  Zap, 
  Globe, 
  ShoppingCart, 
  BarChart3,
  Lock,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("design");

  const features = {
    design: [
      {
        icon: Palette,
        title: "Advanced Design Tools",
        description: "Professional design elements with drag-and-drop simplicity",
        highlight: "200+ Templates"
      },
      {
        icon: Smartphone,
        title: "Mobile-First Responsive",
        description: "Perfect on every device, automatically optimized",
        highlight: "100% Mobile Ready"
      },
      {
        icon: Sparkles,
        title: "AI-Powered Suggestions",
        description: "Smart recommendations for layout, colors, and content",
        highlight: "AI Assistant"
      }
    ],
    performance: [
      {
        icon: Zap,
        title: "Lightning Fast Loading",
        description: "Optimized code and CDN delivery for speed",
        highlight: "< 2s Load Time"
      },
      {
        icon: Globe,
        title: "Global CDN",
        description: "Worldwide content delivery for optimal performance",
        highlight: "99.9% Uptime"
      },
      {
        icon: BarChart3,
        title: "Analytics & Insights",
        description: "Detailed visitor analytics and performance metrics",
        highlight: "Real-time Data"
      }
    ],
    business: [
      {
        icon: ShoppingCart,
        title: "E-commerce Ready",
        description: "Built-in store functionality with payment processing",
        highlight: "0% Commission"
      },
      {
        icon: Users,
        title: "Team Collaboration",
        description: "Work together with your team in real-time",
        highlight: "Unlimited Users"
      },
      {
        icon: Lock,
        title: "Enterprise Security",
        description: "Bank-level security with SSL and data protection",
        highlight: "SOC 2 Compliant"
      }
    ]
  };

  const tabs = [
    { id: "design", label: "Design & UX", icon: Palette },
    { id: "performance", label: "Performance", icon: Zap },
    { id: "business", label: "Business Tools", icon: ShoppingCart }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              build amazing websites
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From stunning designs to powerful business tools, we've got everything covered
            to help you create professional websites that convert.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="lg"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                  : "hover:bg-indigo-50 hover:border-indigo-300"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Highlight Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {feature.highlight}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors">
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators building amazing websites</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold"
            >
              Start Free Trial
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
