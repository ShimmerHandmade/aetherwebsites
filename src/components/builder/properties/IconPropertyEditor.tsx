
import React from "react";
import { PropertyEditorProps } from "./PropertyEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, User, Mail, Phone, MapPin, Star, Heart, 
  ShoppingCart, Search, Menu, X, ChevronRight,
  Facebook, Twitter, Instagram, Linkedin, Youtube
} from "lucide-react";

const IconPropertyEditor: React.FC<PropertyEditorProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.props || {};
  
  const iconOptions = [
    { name: "Home", icon: Home, value: "home" },
    { name: "User", icon: User, value: "user" },
    { name: "Mail", icon: Mail, value: "mail" },
    { name: "Phone", icon: Phone, value: "phone" },
    { name: "Map Pin", icon: MapPin, value: "map-pin" },
    { name: "Star", icon: Star, value: "star" },
    { name: "Heart", icon: Heart, value: "heart" },
    { name: "Shopping Cart", icon: ShoppingCart, value: "shopping-cart" },
    { name: "Search", icon: Search, value: "search" },
    { name: "Menu", icon: Menu, value: "menu" },
    { name: "Close", icon: X, value: "x" },
    { name: "Arrow Right", icon: ChevronRight, value: "chevron-right" },
    { name: "Facebook", icon: Facebook, value: "facebook" },
    { name: "Twitter", icon: Twitter, value: "twitter" },
    { name: "Instagram", icon: Instagram, value: "instagram" },
    { name: "LinkedIn", icon: Linkedin, value: "linkedin" },
    { name: "YouTube", icon: Youtube, value: "youtube" },
  ];
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="icon" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="icon">Icon</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="icon" className="space-y-4">
          <div className="space-y-3">
            <Label>Choose Icon</Label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={properties.iconName === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPropertyChange("iconName", option.value)}
                    className="h-12 flex flex-col items-center gap-1"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Size</Label>
              <Select 
                value={properties.size || "24"}
                onValueChange={(value) => onPropertyChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">Small (16px)</SelectItem>
                  <SelectItem value="20">Medium (20px)</SelectItem>
                  <SelectItem value="24">Large (24px)</SelectItem>
                  <SelectItem value="32">Extra Large (32px)</SelectItem>
                  <SelectItem value="48">Huge (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                type="color"
                value={properties.color || "#000000"}
                onChange={(e) => onPropertyChange("color", e.target.value)}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stroke Width</Label>
              <Select 
                value={String(properties.strokeWidth || 2)}
                onValueChange={(value) => onPropertyChange("strokeWidth", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Thin (1)</SelectItem>
                  <SelectItem value="2">Normal (2)</SelectItem>
                  <SelectItem value="3">Bold (3)</SelectItem>
                  <SelectItem value="4">Extra Bold (4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconPropertyEditor;
