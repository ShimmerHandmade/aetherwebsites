
import React, { useState, useEffect } from "react";
import { useBuilder } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const ElementProperties = () => {
  const { elements, selectedElementId, updateElement } = useBuilder();
  const [content, setContent] = useState("");
  const [properties, setProperties] = useState<Record<string, any>>({});

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement.content || "");
      setProperties(selectedElement.props || {});
    } else {
      setContent("");
      setProperties({});
    }
  }, [selectedElement]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { content: newContent });
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    const updatedProps = { ...properties, [property]: value };
    setProperties(updatedProps);
    
    if (selectedElementId) {
      updateElement(selectedElementId, { props: updatedProps });
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Properties: {selectedElement.type}</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="elementContent" className="text-sm text-gray-600 block mb-1">
            Content
          </Label>
          <Input
            id="elementContent"
            value={content}
            onChange={handleContentChange}
            className="w-full"
          />
        </div>

        {/* Container and Section Properties */}
        {(selectedElement.type === "container" || selectedElement.type === "section") && (
          <>
            <div>
              <Label htmlFor="padding" className="text-sm text-gray-600 block mb-1">
                Padding
              </Label>
              <Select 
                value={properties.padding || "medium"}
                onValueChange={(value) => handlePropertyChange("padding", value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Select padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="background" className="text-sm text-gray-600 block mb-1">
                Background
              </Label>
              <Select 
                value={properties.background || "white"}
                onValueChange={(value) => handlePropertyChange("background", value)}
              >
                <SelectTrigger id="background">
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Heading Properties */}
        {selectedElement.type === "heading" && (
          <div>
            <Label htmlFor="headingLevel" className="text-sm text-gray-600 block mb-1">
              Heading Level
            </Label>
            <Select 
              value={properties.level || "h2"}
              onValueChange={(value) => handlePropertyChange("level", value)}
            >
              <SelectTrigger id="headingLevel">
                <SelectValue placeholder="Select heading level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Image Properties */}
        {selectedElement.type === "image" && (
          <>
            <div>
              <Label htmlFor="imageSrc" className="text-sm text-gray-600 block mb-1">
                Image URL
              </Label>
              <Input
                id="imageSrc"
                value={properties.src || ""}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt" className="text-sm text-gray-600 block mb-1">
                Alt Text
              </Label>
              <Input
                id="imageAlt"
                value={properties.alt || ""}
                onChange={(e) => handlePropertyChange("alt", e.target.value)}
                placeholder="Image description"
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Button Properties */}
        {selectedElement.type === "button" && (
          <div>
            <Label htmlFor="buttonVariant" className="text-sm text-gray-600 block mb-1">
              Button Style
            </Label>
            <Select 
              value={properties.variant || "primary"}
              onValueChange={(value) => handlePropertyChange("variant", value)}
            >
              <SelectTrigger id="buttonVariant">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Feature Card Properties */}
        {selectedElement.type === "feature" && (
          <>
            <div>
              <Label htmlFor="featureDescription" className="text-sm text-gray-600 block mb-1">
                Description
              </Label>
              <Textarea
                id="featureDescription"
                value={properties.description || ""}
                onChange={(e) => handlePropertyChange("description", e.target.value)}
                placeholder="Feature description"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="featureIcon" className="text-sm text-gray-600 block mb-1">
                Icon
              </Label>
              <Input
                id="featureIcon"
                value={properties.icon || ""}
                onChange={(e) => handlePropertyChange("icon", e.target.value)}
                placeholder="★"
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Testimonial Properties */}
        {selectedElement.type === "testimonial" && (
          <>
            <div>
              <Label htmlFor="testimonialAuthor" className="text-sm text-gray-600 block mb-1">
                Author Name
              </Label>
              <Input
                id="testimonialAuthor"
                value={properties.author || ""}
                onChange={(e) => handlePropertyChange("author", e.target.value)}
                placeholder="John Doe"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="testimonialRole" className="text-sm text-gray-600 block mb-1">
                Role/Position
              </Label>
              <Input
                id="testimonialRole"
                value={properties.role || ""}
                onChange={(e) => handlePropertyChange("role", e.target.value)}
                placeholder="Customer"
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Pricing Properties */}
        {selectedElement.type === "pricing" && (
          <Collapsible className="space-y-2">
            <div>
              <Label htmlFor="price" className="text-sm text-gray-600 block mb-1">
                Price
              </Label>
              <Input
                id="price"
                value={properties.price || ""}
                onChange={(e) => handlePropertyChange("price", e.target.value)}
                placeholder="$9.99"
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="period" className="text-sm text-gray-600 block mb-1">
                Billing Period
              </Label>
              <Select 
                value={properties.period || "monthly"}
                onValueChange={(value) => handlePropertyChange("period", value)}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium text-left py-2">
              <span>Features List</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-2 border-l-2 border-gray-100 space-y-2">
              {(properties.features || ["Feature 1", "Feature 2"]).map((feature: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(properties.features || [])];
                      newFeatures[index] = e.target.value;
                      handlePropertyChange("features", newFeatures);
                    }}
                    className="w-full"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newFeatures = [...(properties.features || [])];
                      newFeatures.splice(index, 1);
                      handlePropertyChange("features", newFeatures);
                    }}
                    className="p-2 text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => {
                  const newFeatures = [...(properties.features || []), "New Feature"];
                  handlePropertyChange("features", newFeatures);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Feature
              </button>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default ElementProperties;
