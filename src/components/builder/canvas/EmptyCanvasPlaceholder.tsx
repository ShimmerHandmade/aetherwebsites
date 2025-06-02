
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBuilder } from "@/contexts/builder/useBuilder";
import { v4 as uuidv4 } from "@/lib/uuid";
import { 
  Layout, 
  Type, 
  Image, 
  Square,
  Sparkles,
  ArrowDown
} from "lucide-react";

interface EmptyCanvasPlaceholderProps {
  isPreviewMode: boolean;
}

const EmptyCanvasPlaceholder: React.FC<EmptyCanvasPlaceholderProps> = ({ 
  isPreviewMode 
}) => {
  const { addElement } = useBuilder();

  const quickStartElements = [
    {
      type: "hero",
      name: "Hero Section",
      icon: Layout,
      content: "Welcome to Your Website",
      props: { 
        height: "large", 
        variant: "default",
        subtitle: "Create something amazing with our builder",
        showButton: true,
        buttonText: "Get Started",
        buttonUrl: "#"
      }
    },
    {
      type: "section",
      name: "Content Section",
      icon: Square,
      content: "",
      props: { padding: "large", backgroundColor: "bg-white" },
      children: [
        {
          id: uuidv4(),
          type: "heading",
          content: "About Us",
          props: { level: "h2", className: "text-3xl font-bold text-center mb-6" }
        },
        {
          id: uuidv4(),
          type: "text",
          content: "Tell your story here. Share what makes your business unique and why customers should choose you.",
          props: { className: "text-center text-gray-600 max-w-2xl mx-auto" }
        }
      ]
    }
  ];

  const handleQuickStart = (elementData: any) => {
    const newElement = {
      id: uuidv4(),
      type: elementData.type,
      content: elementData.content,
      props: elementData.props,
      children: elementData.children
    };
    
    addElement(newElement);
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Content Yet</h2>
          <p className="text-gray-500">Add some elements to see your page come to life!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Building Your Website
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Drag elements from the sidebar or use our quick start options below
          </p>
        </div>

        {/* Quick Start Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {quickStartElements.map((element, index) => {
            const Icon = element.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                onClick={() => handleQuickStart(element)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{element.name}</h3>
                  <p className="text-sm text-gray-600">
                    Add a {element.name.toLowerCase()} to get started quickly
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Drag and Drop Hint */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
          <div className="flex items-center justify-center mb-4">
            <ArrowDown className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Drag elements here from the sidebar</span>
            <ArrowDown className="w-6 h-6 text-gray-400 ml-2" />
          </div>
          <p className="text-sm text-gray-500">
            Or use the element palette on the left to add content to your page
          </p>
        </div>

        {/* Tips */}
        <div className="mt-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">💡 Quick Tips:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Drag elements from the left sidebar to add content</li>
            <li>• Click on any element to edit its properties</li>
            <li>• Use the preview mode to see how your site looks to visitors</li>
            <li>• Reorder elements by dragging them within the canvas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyCanvasPlaceholder;
