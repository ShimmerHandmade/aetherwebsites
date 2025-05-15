
import React, { useState } from "react";
import {
  LayoutDashboard,
  List,
  Text,
  Heading,
  ImageIcon,
  Package,
  Layout,
  Layers,
  Shield,
  VideoIcon,
  FormInput,
  ListIcon,
  CreditCard,
  MessageSquare,
  Star,
  Columns,
  LayoutGrid,
  Tv2,
  Globe2,
  Menu,
  Copyright,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

export interface ElementCategory {
  name: string;
  elements: ElementDefinition[];
}

export interface ElementDefinition {
  type: string;
  name: string;
  icon: keyof typeof LucideIcons;
  description: string;
  defaultProps?: any;
}

// Mapping of Lucide icon names to their corresponding React components
const LucideIcons = {
  "layout-dashboard": LayoutDashboard,
  list: List,
  text: Text,
  heading: Heading,
  "image-icon": ImageIcon,
  "button": LayoutDashboard,
  package: Package,
  layout: Layout,
  image: ImageIcon, // Changed from ImageIconComponent to ImageIcon
  video: VideoIcon,
  form: FormInput,
  "list-icon": ListIcon,
  "credit-card": CreditCard,
  "message-square": MessageSquare,
  star: Star,
  columns: Columns,
  "layout-grid": LayoutGrid,
  tv2: Tv2,
  "globe-2": Globe2,
  menu: Menu,
  copyright: Copyright,
};

// Element definitions for the builder
const elementCategories: ElementCategory[] = [
  {
    name: "Layout",
    elements: [
      {
        type: "section",
        name: "Section",
        icon: "layout",
        description: "A basic container for content",
        defaultProps: {
          padding: "medium",
        },
      },
      {
        type: "container",
        name: "Container",
        icon: "layout-dashboard",
        description: "A fixed-width container for content",
        defaultProps: {
          maxWidth: "1200px",
        },
      },
      {
        type: "flex",
        name: "Flex",
        icon: "columns",
        description: "A flexible layout container",
        defaultProps: {
          direction: "row",
          justify: "start",
          align: "stretch",
        },
      },
      {
        type: "grid",
        name: "Grid",
        icon: "layout-grid",
        description: "A grid layout container",
        defaultProps: {
          columns: 3,
          gap: "medium",
        },
      },
      {
        type: "hero",
        name: "Hero",
        icon: "tv2",
        description: "A hero section for showcasing content",
        defaultProps: {
          variant: "default",
        },
      },
      {
        type: "spacer",
        name: "Spacer",
        icon: "globe-2",
        description: "A spacing element",
        defaultProps: {
          size: "medium",
        },
      },
      {
        type: "divider",
        name: "Divider",
        icon: "menu",
        description: "A horizontal divider line",
        defaultProps: {
          style: "solid",
        },
      },
      {
        type: "animatedSection",
        name: "Animated Section",
        icon: "layout",
        description: "A section with premium animations (Premium)",
        defaultProps: {
          padding: "medium",
          hasAnimation: true,
          animationType: "premium",
          animationEffect: "fade-in",
          backgroundColor: "bg-white"
        },
      },
    ],
  },
  {
    name: "Content",
    elements: [
      {
        type: "heading",
        name: "Heading",
        icon: "heading",
        description: "A title or heading text",
        defaultProps: {
          level: "h2",
        },
      },
      {
        type: "text",
        name: "Text",
        icon: "text",
        description: "A paragraph of text",
        defaultProps: {
          fontSize: "medium",
        },
      },
      {
        type: "image",
        name: "Image",
        icon: "image",
        description: "An image element",
        defaultProps: {
          src: "https://via.placeholder.com/300",
          alt: "Placeholder Image",
        },
      },
      {
        type: "button",
        name: "Button",
        icon: "button",
        description: "A clickable button",
        defaultProps: {
          label: "Click me",
          variant: "primary",
        },
      },
      {
        type: "list",
        name: "List",
        icon: "list-icon",
        description: "A list of items",
        defaultProps: {
          items: ["Item 1", "Item 2", "Item 3"],
          style: "unordered",
        },
      },
      {
        type: "animatedHeading",
        name: "Animated Heading",
        icon: "heading",
        description: "A heading with entrance animation (Premium)",
        defaultProps: {
          level: "h2",
          hasAnimation: true,
          animationType: "premium",
          animationEffect: "fade-in"
        },
      },
    ],
  },
  {
    name: "Interactive",
    elements: [
      {
        type: "form",
        name: "Form",
        icon: "form",
        description: "A form for user input",
        defaultProps: {
          fields: ["Name", "Email", "Message"],
        },
      },
    ],
  },
  {
    name: "Animations",
    elements: [
      {
        type: "fadeInElement",
        name: "Fade In",
        icon: "star",
        description: "Element that fades in on page load (Premium)",
        defaultProps: {
          hasAnimation: true,
          animationType: "premium",
          animationEffect: "fade-in",
          content: "This content will fade in"
        },
      },
      {
        type: "slideInElement",
        name: "Slide In",
        icon: "star",
        description: "Element that slides in from the side (Premium)",
        defaultProps: {
          hasAnimation: true,
          animationType: "premium",
          animationEffect: "slide-in-right",
          content: "This content will slide in"
        },
      },
      {
        type: "scaleInElement",
        name: "Scale In",
        icon: "star",
        description: "Element that scales in on page load (Premium)",
        defaultProps: {
          hasAnimation: true,
          animationType: "premium",
          animationEffect: "scale-in",
          content: "This content will scale in"
        },
      },
      {
        type: "particlesBackground",
        name: "Particles Background",
        icon: "star",
        description: "Interactive particle animation background (Enterprise)",
        defaultProps: {
          hasAnimation: true,
          animationType: "enterprise",
          animationEffect: "particles",
          particleColor: "#4f46e5",
          particleCount: 50
        },
      },
      {
        type: "scrollReveal",
        name: "Scroll Reveal",
        icon: "star",
        description: "Element that reveals on scroll (Enterprise)",
        defaultProps: {
          hasAnimation: true,
          animationType: "enterprise",
          animationEffect: "scroll-reveal",
          content: "This content will reveal on scroll"
        },
      },
    ],
  },
  {
    name: "Complex",
    elements: [
      {
        type: "feature",
        name: "Feature",
        icon: "star",
        description: "A feature block with icon and text",
        defaultProps: {
          title: "Feature Title",
          description: "Feature description goes here.",
        },
      },
      {
        type: "testimonial",
        name: "Testimonial",
        icon: "message-square",
        description: "A testimonial block with author and quote",
        defaultProps: {
          quote: "This is a testimonial quote.",
          author: "John Doe",
        },
      },
      {
        type: "pricing",
        name: "Pricing",
        icon: "credit-card",
        description: "A pricing table",
        defaultProps: {
          title: "Basic",
          price: "$9.99",
          features: ["Feature 1", "Feature 2", "Feature 3"],
        },
      },
      {
        type: "card",
        name: "Card",
        icon: "credit-card",
        description: "A card with title, description and image",
        defaultProps: {
          title: "Card Title",
          description: "Card description goes here.",
        },
      },
      {
        type: "productsList",
        name: "Products List",
        icon: "package",
        description: "Display products from your store",
        defaultProps: {
          columns: 4,
          productsPerPage: 8,
          showPagination: true,
          cardStyle: "default"
        }
      },
    ],
  },
  {
    name: "Navigation",
    elements: [
      {
        type: "navbar",
        name: "Navbar",
        icon: "menu",
        description: "A navigation bar",
        defaultProps: {
          siteName: "Your Website",
          links: [
            { text: "Home", url: "#" },
            { text: "About", url: "#" },
            { text: "Services", url: "#" },
            { text: "Contact", url: "#" },
          ],
          variant: "default",
        },
      },
      {
        type: "footer",
        name: "Footer",
        icon: "copyright",
        description: "A footer section",
        defaultProps: {
          siteName: "Your Website",
          links: [
            { text: "Home", url: "#" },
            { text: "About", url: "#" },
            { text: "Services", url: "#" },
            { text: "Contact", url: "#" },
          ],
          variant: "dark",
        },
      },
    ],
  },
];

export const addElement = (type: string): BuilderElement => {
  const elementDef = elementCategories
    .flatMap((category) => category.elements)
    .find((element) => element.type === type);

  if (!elementDef) {
    console.warn(`No element definition found for type: ${type}`);
    return {
      id: uuidv4(),
      type: "text",
      content: `Unknown element type: ${type}`,
    };
  }

  return {
    id: uuidv4(),
    type: type,
    content: "",
    props: elementDef.defaultProps || {},
  };
};

// Create a React component to render the element palette
const ElementPaletteComponent: React.FC = () => {
  // Track which categories are open
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    // Start with all categories open
    return elementCategories.reduce((acc, category) => {
      acc[category.name] = true; // Set all categories to open by default
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  // Get plan info to check premium access
  const { isPremium, isEnterprise } = usePlan();

  // Toggle a category's open state
  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Check if an element is premium/enterprise
  const isElementPremium = (element: ElementDefinition) => {
    return element.defaultProps?.animationType === 'premium' || element.type.includes('animated');
  };

  const isElementEnterprise = (element: ElementDefinition) => {
    return element.defaultProps?.animationType === 'enterprise';
  };

  // Handle drag start for an element
  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, element: ElementDefinition) => {
    // Check plan restrictions
    if (isElementPremium(element) && !isPremium) {
      event.preventDefault();
      toast.error("Premium feature not available", {
        description: "Upgrade to Professional or Enterprise plan to use this element"
      });
      return false;
    }

    if (isElementEnterprise(element) && !isEnterprise) {
      event.preventDefault();
      toast.error("Enterprise feature not available", {
        description: "Upgrade to Enterprise plan to use this element"
      });
      return false;
    }
    
    // Create the data to transfer
    const elementData = {
      type: element.type,
      props: element.defaultProps || {},
      content: ""
    };
    
    // Set the drag data as JSON
    event.dataTransfer.setData("application/json", JSON.stringify(elementData));
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-4 py-2">
      {elementCategories.map((category) => (
        <Collapsible
          key={category.name}
          open={openCategories[category.name]}
          onOpenChange={() => toggleCategory(category.name)}
          className="border border-gray-100 rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
            {openCategories[category.name] ? 
              <ChevronDown className="h-4 w-4 text-gray-500" /> : 
              <ChevronRight className="h-4 w-4 text-gray-500" />
            }
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2 p-3 bg-white">
              {category.elements.map((element) => {
                const IconComponent = LucideIcons[element.icon];
                const isPremiumElement = isElementPremium(element);
                const isEnterpriseElement = isElementEnterprise(element);
                const isLocked = (isPremiumElement && !isPremium) || (isEnterpriseElement && !isEnterprise);
                
                return (
                  <button
                    key={element.type}
                    className={`relative flex flex-col items-center justify-center p-3 text-center bg-white border border-gray-200 rounded-lg ${isLocked ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-200'} transition-colors`}
                    title={`${element.description}${isLocked ? ' - Requires upgrade' : ''}`}
                    draggable={!isLocked}
                    onDragStart={(e) => handleDragStart(e, element)}
                    onClick={() => {
                      if (isLocked) {
                        toast.error(`${isEnterpriseElement ? 'Enterprise' : 'Premium'} feature not available`, {
                          description: `Upgrade to ${isEnterpriseElement ? 'Enterprise' : 'Professional or Enterprise'} plan to use this element`
                        });
                      }
                    }}
                  >
                    {/* Premium badge */}
                    {(isPremiumElement || isEnterpriseElement) && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        {isLocked ? <Lock className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        <span>{isEnterpriseElement ? "Enterprise" : "Premium"}</span>
                      </div>
                    )}
                    
                    {IconComponent && <IconComponent className={`h-5 w-5 mb-1 ${isLocked ? 'text-gray-400' : 'text-blue-600'}`} />}
                    <span className="text-xs mt-1">{element.name}</span>
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

// Export both the component and the categories
export default ElementPaletteComponent;
export { elementCategories };
