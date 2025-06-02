
import React, { useState, useMemo } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { usePlan } from "@/contexts/PlanContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "@/lib/uuid";
import {
  Type,
  Image,
  Video,
  Square,
  FormInput,
  FileText,
  Package,
  Users,
  CreditCard,
  Layout,
  Grid,
  Move,
  Navigation,
  Star,
  PlayCircle,
  Sparkles,
  Crown,
  Lock,
  Search,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface ElementTemplate {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
  isPremium: boolean;
  isEnterprise: boolean;
  props?: any;
  children?: any[];
}

const elementTemplates: ElementTemplate[] = [
  // Layout Elements
  {
    id: "section",
    name: "Section",
    type: "section",
    icon: Square,
    category: "layout",
    description: "Container section with padding",
    isPremium: false,
    isEnterprise: false,
    props: { padding: "large", backgroundColor: "bg-white" }
  },
  {
    id: "container",
    name: "Container",
    type: "container",
    icon: Layout,
    category: "layout",
    description: "Flexible container for content",
    isPremium: false,
    isEnterprise: false,
    props: { maxWidth: "container", padding: "medium" }
  },
  {
    id: "grid",
    name: "Grid",
    type: "grid",
    icon: Grid,
    category: "layout",
    description: "CSS Grid layout system",
    isPremium: false,
    isEnterprise: false,
    props: { columns: 3, gap: "medium" }
  },
  {
    id: "flex",
    name: "Flex",
    type: "flex",
    icon: Move,
    category: "layout",
    description: "Flexbox layout container",
    isPremium: false,
    isEnterprise: false,
    props: { direction: "row", justify: "center", align: "center" }
  },
  {
    id: "hero",
    name: "Hero Section",
    type: "hero",
    icon: Star,
    category: "layout",
    description: "Large hero banner section",
    isPremium: false,
    isEnterprise: false,
    props: { variant: "default", height: "large" }
  },

  // Content Elements
  {
    id: "heading",
    name: "Heading",
    type: "heading",
    icon: Type,
    category: "content",
    description: "Text heading (H1-H6)",
    isPremium: false,
    isEnterprise: false,
    props: { level: "h2", className: "text-2xl font-bold" }
  },
  {
    id: "text",
    name: "Text",
    type: "text",
    icon: FileText,
    category: "content",
    description: "Paragraph text content",
    isPremium: false,
    isEnterprise: false,
    props: { className: "text-gray-600" }
  },
  {
    id: "button",
    name: "Button",
    type: "button",
    icon: Package,
    category: "content",
    description: "Interactive button element",
    isPremium: false,
    isEnterprise: false,
    props: { variant: "primary", size: "default" }
  },
  {
    id: "image",
    name: "Image",
    type: "image",
    icon: Image,
    category: "content",
    description: "Image with alt text",
    isPremium: false,
    isEnterprise: false,
    props: { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", alt: "Placeholder image" }
  },

  // Interactive Elements
  {
    id: "form",
    name: "Form",
    type: "form",
    icon: FormInput,
    category: "interactive",
    description: "Form container",
    isPremium: false,
    isEnterprise: false,
    props: { method: "POST" }
  },
  {
    id: "input",
    name: "Input",
    type: "input",
    icon: FormInput,
    category: "interactive",
    description: "Text input field",
    isPremium: false,
    isEnterprise: false,
    props: { type: "text", placeholder: "Enter text..." }
  },

  // Complex Elements
  {
    id: "card",
    name: "Card",
    type: "card",
    icon: Package,
    category: "complex",
    description: "Content card with title and description",
    isPremium: false,
    isEnterprise: false,
    props: { showButton: true, buttonText: "Learn More" }
  },
  {
    id: "feature",
    name: "Feature",
    type: "feature",
    icon: Star,
    category: "complex",
    description: "Feature showcase with icon",
    isPremium: false,
    isEnterprise: false,
    props: { iconName: "star", layout: "vertical" }
  },
  {
    id: "testimonial",
    name: "Testimonial",
    type: "testimonial",
    icon: Users,
    category: "complex",
    description: "Customer testimonial card",
    isPremium: true,
    isEnterprise: false,
    props: { showAvatar: true, showRating: true }
  },
  {
    id: "pricing",
    name: "Pricing",
    type: "pricing",
    icon: CreditCard,
    category: "complex",
    description: "Pricing table component",
    isPremium: true,
    isEnterprise: false,
    props: { featured: false, buttonText: "Get Started" }
  },
  {
    id: "productsList",
    name: "Products List",
    type: "productsList",
    icon: Package,
    category: "ecommerce",
    description: "Display products in a grid",
    isPremium: false,
    isEnterprise: false,
    props: { columns: 3, showPagination: true }
  },

  // Media Elements
  {
    id: "video",
    name: "Video",
    type: "video",
    icon: Video,
    category: "media",
    description: "Video player component",
    isPremium: false,
    isEnterprise: false,
    props: { src: "", controls: true }
  },
  {
    id: "carousel",
    name: "Carousel",
    type: "carousel",
    icon: PlayCircle,
    category: "media",
    description: "Image carousel/slider",
    isPremium: true,
    isEnterprise: false,
    props: { autoplay: false, showDots: true }
  },

  // Navigation Elements
  {
    id: "navbar",
    name: "Navigation Bar",
    type: "navbar",
    icon: Navigation,
    category: "navigation",
    description: "Site navigation header",
    isPremium: false,
    isEnterprise: false,
    props: { variant: "default", siteName: "My Website" }
  },
  {
    id: "footer",
    name: "Footer",
    type: "footer",
    icon: Navigation,
    category: "navigation",
    description: "Site footer section",
    isPremium: false,
    isEnterprise: false,
    props: { variant: "dark", siteName: "My Website" }
  },

  // Animation Elements (Enterprise)
  {
    id: "fadeInElement",
    name: "Fade In Animation",
    type: "fadeInElement",
    icon: Sparkles,
    category: "animation",
    description: "Fade in animation wrapper",
    isPremium: false,
    isEnterprise: true,
    props: { duration: "0.5s", delay: "0s" }
  },
  {
    id: "slideInElement",
    name: "Slide In Animation",
    type: "slideInElement",
    icon: Sparkles,
    category: "animation",
    description: "Slide in animation wrapper",
    isPremium: false,
    isEnterprise: true,
    props: { direction: "left", duration: "0.5s" }
  }
];

const categories = [
  { id: "all", name: "All", icon: Grid },
  { id: "layout", name: "Layout", icon: Layout },
  { id: "content", name: "Content", icon: Type },
  { id: "interactive", name: "Forms", icon: FormInput },
  { id: "complex", name: "Complex", icon: Package },
  { id: "ecommerce", name: "Shop", icon: Package },
  { id: "media", name: "Media", icon: Video },
  { id: "navigation", name: "Nav", icon: Navigation },
  { id: "animation", name: "FX", icon: Sparkles }
];

const ElementPalette: React.FC = () => {
  const { addElement } = useBuilder();
  const { isPremium, isEnterprise, checkUpgrade } = usePlan();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredElements = useMemo(() => {
    return elementTemplates.filter(element => {
      const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          element.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "all" || element.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleAddElement = (template: ElementTemplate) => {
    // Check plan restrictions
    if (template.isPremium && !isPremium && !isEnterprise) {
      checkUpgrade(`${template.name} element`);
      return;
    }

    if (template.isEnterprise && !isEnterprise) {
      checkUpgrade(`${template.name} element`);
      return;
    }

    const newElement = {
      id: uuidv4(),
      type: template.type,
      content: template.name === "Heading" ? "Your Heading Here" : 
               template.name === "Text" ? "Your content goes here..." :
               template.name === "Button" ? "Click me" :
               template.name === "Card" ? "Card Title" :
               template.name === "Feature" ? "Feature Title" :
               "",
      props: { ...template.props },
      children: template.children || undefined
    };

    addElement(newElement);
    toast.success(`${template.name} added to canvas`);
  };

  const getElementIcon = (template: ElementTemplate) => {
    if (template.isEnterprise && !isEnterprise) {
      return <Lock className="h-4 w-4" />;
    }
    if (template.isPremium && !isPremium) {
      return <Crown className="h-4 w-4" />;
    }
    return <Plus className="h-4 w-4" />;
  };

  const getElementBadge = (template: ElementTemplate) => {
    if (template.isEnterprise) {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
          <Crown className="h-3 w-3 mr-1" />
          Enterprise
        </Badge>
      );
    }
    if (template.isPremium) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Search */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-xs p-2 rounded-md flex flex-col items-center gap-1 transition-colors ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-2">
            {filteredElements.map((template) => {
              const Icon = template.icon;
              const isLocked = (template.isPremium && !isPremium) || (template.isEnterprise && !isEnterprise);
              
              return (
                <Button
                  key={template.id}
                  variant="outline"
                  className={`w-full h-auto p-3 justify-start ${
                    isLocked ? 'opacity-60 hover:opacity-80' : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => handleAddElement(template)}
                >
                  <div className="flex items-start space-x-3 w-full text-left">
                    <div className={`p-2 rounded-md flex-shrink-0 ${isLocked ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      <Icon className={`h-4 w-4 ${isLocked ? 'text-gray-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{template.name}</span>
                        {getElementIcon(template)}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                      {getElementBadge(template) && (
                        <div className="mt-1">
                          {getElementBadge(template)}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}

            {filteredElements.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No elements found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ElementPalette;
