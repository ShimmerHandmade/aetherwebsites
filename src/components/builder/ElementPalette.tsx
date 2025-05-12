import React from "react";
import {
  LayoutDashboard,
  List,
  Text,
  Heading,
  ImageIcon,
  Package,
  Layout,
  Image as ImageIconComponent,
  Video as VideoIcon,
  FormInput,
  List as ListIcon,
  CreditCard,
  MessageSquare,
  Star,
  Columns,
  LayoutGrid,
  Tv2,
  Globe2,
  Menu,
  Copyright,
} from "lucide-react";
import { v4 as uuidv4 } from "@/lib/uuid";
import { BuilderElement } from "@/contexts/BuilderContext";

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
  image: ImageIconComponent,
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
  return (
    <div className="space-y-6">
      {elementCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{category.name}</h3>
          <div className="grid grid-cols-2 gap-2">
            {category.elements.map((element) => {
              const IconComponent = LucideIcons[element.icon];
              return (
                <button
                  key={element.type}
                  className="flex flex-col items-center justify-center p-3 text-center bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  title={element.description}
                  onClick={() => addElement(element.type)}
                >
                  {IconComponent && <IconComponent className="h-5 w-5 mb-1 text-blue-600" />}
                  <span className="text-xs mt-1">{element.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Export both the component and the categories
export default ElementPaletteComponent;
export { elementCategories };
