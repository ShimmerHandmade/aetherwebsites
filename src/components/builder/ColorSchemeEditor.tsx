
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Save, RotateCcw, Eye, Wand2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ColorSchemeEditorProps {
  onSave?: (scheme: ColorScheme) => void;
  onClose?: () => void;
}

const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({ onSave, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentScheme, setCurrentScheme] = useState<ColorScheme>({
    primary: "#3b82f6",
    secondary: "#8b5cf6", 
    accent: "#06b6d4",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0"
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Apply color scheme ONLY to canvas elements
  const applyColorSchemeToCanvas = (scheme: ColorScheme) => {
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Target only canvas container and its children
    const canvasContainer = document.querySelector('[data-canvas-container="true"]');
    
    if (canvasContainer) {
      const element = canvasContainer as HTMLElement;
      
      // Apply CSS custom properties to canvas container
      element.style.setProperty('--primary', hexToHsl(scheme.primary));
      element.style.setProperty('--secondary', hexToHsl(scheme.secondary));
      element.style.setProperty('--accent', hexToHsl(scheme.accent));
      element.style.setProperty('--background', hexToHsl(scheme.background));
      element.style.setProperty('--card', hexToHsl(scheme.surface));
      element.style.setProperty('--foreground', hexToHsl(scheme.text));
      element.style.setProperty('--muted-foreground', hexToHsl(scheme.textSecondary));
      element.style.setProperty('--border', hexToHsl(scheme.border));
      
      // Apply direct color styles for immediate effect
      element.style.setProperty('--color-primary', scheme.primary);
      element.style.setProperty('--color-secondary', scheme.secondary);
      element.style.setProperty('--color-accent', scheme.accent);
      element.style.setProperty('--color-background', scheme.background);
      element.style.setProperty('--color-surface', scheme.surface);
      element.style.setProperty('--color-text', scheme.text);
      element.style.setProperty('--color-text-secondary', scheme.textSecondary);
      element.style.setProperty('--color-border', scheme.border);

      // Apply to all elements within the canvas only
      const canvasElements = canvasContainer.querySelectorAll('[data-element-id], .builder-element');
      canvasElements.forEach(child => {
        const childElement = child as HTMLElement;
        childElement.style.setProperty('--primary', hexToHsl(scheme.primary));
        childElement.style.setProperty('--secondary', hexToHsl(scheme.secondary));
        childElement.style.setProperty('--accent', hexToHsl(scheme.accent));
        childElement.style.setProperty('--background', hexToHsl(scheme.background));
        childElement.style.setProperty('--card', hexToHsl(scheme.surface));
        childElement.style.setProperty('--foreground', hexToHsl(scheme.text));
        childElement.style.setProperty('--muted-foreground', hexToHsl(scheme.textSecondary));
        childElement.style.setProperty('--border', hexToHsl(scheme.border));
      });
      
      console.log("Color scheme applied to canvas elements only");
    } else {
      console.warn("Canvas container not found, colors not applied");
    }
  };

  // Predefined color schemes
  const presetSchemes = [
    {
      name: "Ocean Blue",
      scheme: {
        primary: "#0ea5e9",
        secondary: "#0284c7",
        accent: "#06b6d4",
        background: "#ffffff",
        surface: "#f0f9ff",
        text: "#0c4a6e",
        textSecondary: "#475569",
        border: "#bae6fd"
      }
    },
    {
      name: "Forest Green",
      scheme: {
        primary: "#059669",
        secondary: "#047857",
        accent: "#10b981",
        background: "#ffffff",
        surface: "#f0fdf4",
        text: "#064e3b",
        textSecondary: "#475569",
        border: "#bbf7d0"
      }
    },
    {
      name: "Sunset Orange",
      scheme: {
        primary: "#ea580c",
        secondary: "#dc2626",
        accent: "#f59e0b",
        background: "#ffffff",
        surface: "#fff7ed",
        text: "#9a3412",
        textSecondary: "#475569",
        border: "#fed7aa"
      }
    },
    {
      name: "Purple Dreams",
      scheme: {
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        accent: "#a855f7",
        background: "#ffffff",
        surface: "#faf5ff",
        text: "#581c87",
        textSecondary: "#475569",
        border: "#d8b4fe"
      }
    },
    {
      name: "Dark Mode",
      scheme: {
        primary: "#3b82f6",
        secondary: "#6366f1",
        accent: "#06b6d4",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155"
      }
    }
  ];

  // Handle color change
  const handleColorChange = (colorKey: keyof ColorScheme, value: string) => {
    const newScheme = { ...currentScheme, [colorKey]: value };
    setCurrentScheme(newScheme);
    
    if (previewMode) {
      applyColorSchemeToCanvas(newScheme);
    }
  };

  // Apply preset scheme
  const applyPreset = (preset: ColorScheme) => {
    setCurrentScheme(preset);
    if (previewMode) {
      applyColorSchemeToCanvas(preset);
    }
    toast.success("Color scheme applied to canvas!");
  };

  // Save scheme
  const handleSave = () => {
    applyColorSchemeToCanvas(currentScheme);
    if (onSave) {
      onSave(currentScheme);
    }
    toast.success("Color scheme saved to canvas successfully!");
  };

  // Reset to default
  const handleReset = () => {
    const defaultScheme = {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4", 
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0"
    };
    setCurrentScheme(defaultScheme);
    if (previewMode) {
      applyColorSchemeToCanvas(defaultScheme);
    }
    toast.success("Reset to default colors");
  };

  // Generate random scheme
  const generateRandomScheme = () => {
    const generateColor = () => {
      return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    };

    const newScheme = {
      primary: generateColor(),
      secondary: generateColor(),
      accent: generateColor(),
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0"
    };

    setCurrentScheme(newScheme);
    if (previewMode) {
      applyColorSchemeToCanvas(newScheme);
    }
    toast.success("Random color scheme generated!");
  };

  // Toggle preview mode
  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      applyColorSchemeToCanvas(currentScheme);
      toast.success("Preview mode enabled - colors applied to canvas only");
    } else {
      toast.success("Preview mode disabled");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Quick Color Editor</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/builder/${id}/theme`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Full Theme Editor
          </Button>
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Previewing Canvas" : "Preview Canvas"}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-700">
          <ExternalLink className="h-4 w-4" />
          <p className="text-sm">
            <strong>New!</strong> Try our comprehensive{" "}
            <button 
              onClick={() => navigate(`/builder/${id}/theme`)}
              className="underline hover:no-underline font-medium"
            >
              Theme Editor
            </button>{" "}
            for complete control over colors, typography, and spacing.
          </p>
        </div>
      </div>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="presets">Quick Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Quick Color Customization
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateRandomScheme}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(currentScheme).map(([key, value]) => (
                  <div key={key} className="space-y-3">
                    <Label htmlFor={key} className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id={key}
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                        className="w-12 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                        className="flex-1 font-mono text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Preview */}
              <div className="p-8 rounded-lg border" style={{
                backgroundColor: currentScheme.background,
                borderColor: currentScheme.border
              }}>
                <div className="space-y-6">
                  <h3 style={{ color: currentScheme.text }} className="text-lg font-semibold">
                    Canvas Color Preview
                  </h3>
                  <p style={{ color: currentScheme.textSecondary }} className="text-sm">
                    This preview shows how colors will appear on your canvas elements.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Button style={{ backgroundColor: currentScheme.primary }} className="text-white">
                      Primary Button
                    </Button>
                    <Button 
                      variant="outline" 
                      style={{ 
                        borderColor: currentScheme.secondary,
                        color: currentScheme.secondary
                      }}
                    >
                      Secondary Button
                    </Button>
                    <Badge style={{ backgroundColor: currentScheme.accent }} className="text-white">
                      Accent Badge
                    </Badge>
                  </div>
                  <div 
                    className="p-6 rounded"
                    style={{ backgroundColor: currentScheme.surface }}
                  >
                    <p style={{ color: currentScheme.text }} className="text-sm">
                      Surface element with text
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Color Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presetSchemes.map((preset, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: preset.scheme.background,
                      borderColor: preset.scheme.border
                    }}
                    onClick={() => applyPreset(preset.scheme)}
                  >
                    <h4 style={{ color: preset.scheme.text }} className="font-medium mb-4">
                      {preset.name}
                    </h4>
                    <div className="flex gap-2 mb-4">
                      {Object.entries(preset.scheme).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: preset.scheme.primary }}
                      className="text-white w-full"
                    >
                      Apply to Canvas
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 pt-6 border-t">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Apply to Canvas
        </Button>
      </div>
    </div>
  );
};

export default ColorSchemeEditor;
