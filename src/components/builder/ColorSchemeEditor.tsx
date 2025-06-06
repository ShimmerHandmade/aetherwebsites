
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Save, RotateCcw, Eye, Wand2 } from "lucide-react";
import { toast } from "sonner";

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

  // Apply color scheme to the website canvas
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

    // Find the canvas element - try multiple selectors
    const canvasSelectors = [
      '[data-testid="builder-canvas"]',
      '.builder-canvas',
      '[data-builder-canvas]',
      '[data-element-id]'
    ];

    let canvasElement = null;
    
    for (const selector of canvasSelectors) {
      canvasElement = document.querySelector(selector);
      if (canvasElement) break;
    }

    // If still not found, try to find the canvas in an iframe
    if (!canvasElement) {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentDocument) {
        const iframeDocument = iframe.contentDocument;
        for (const selector of canvasSelectors) {
          canvasElement = iframeDocument.querySelector(selector);
          if (canvasElement) break;
        }
      }
    }

    // Apply to document root if canvas not found
    const targetElement = canvasElement || document.documentElement;
    
    console.log("Applying color scheme to:", targetElement);
    
    // Apply CSS custom properties
    const element = targetElement as HTMLElement;
    element.style.setProperty('--primary', hexToHsl(scheme.primary));
    element.style.setProperty('--secondary', hexToHsl(scheme.secondary));
    element.style.setProperty('--accent', hexToHsl(scheme.accent));
    element.style.setProperty('--background', hexToHsl(scheme.background));
    element.style.setProperty('--card', hexToHsl(scheme.surface));
    element.style.setProperty('--foreground', hexToHsl(scheme.text));
    element.style.setProperty('--muted-foreground', hexToHsl(scheme.textSecondary));
    element.style.setProperty('--border', hexToHsl(scheme.border));
    
    // Also apply direct color styles for immediate effect
    element.style.setProperty('--color-primary', scheme.primary);
    element.style.setProperty('--color-secondary', scheme.secondary);
    element.style.setProperty('--color-accent', scheme.accent);
    element.style.setProperty('--color-background', scheme.background);
    element.style.setProperty('--color-surface', scheme.surface);
    element.style.setProperty('--color-text', scheme.text);
    element.style.setProperty('--color-text-secondary', scheme.textSecondary);
    element.style.setProperty('--color-border', scheme.border);

    // Apply to all child elements with data-element-id
    const childElements = document.querySelectorAll('[data-element-id]');
    childElements.forEach(child => {
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
  };

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
    toast.success("Color scheme applied!");
  };

  // Save scheme
  const handleSave = () => {
    applyColorSchemeToCanvas(currentScheme);
    if (onSave) {
      onSave(currentScheme);
    }
    toast.success("Color scheme saved successfully!");
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
      toast.success("Preview mode enabled - colors applied to website canvas");
    } else {
      toast.success("Preview mode disabled");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Color Scheme Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Previewing Canvas" : "Preview on Canvas"}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          <TabsTrigger value="presets">Preset Schemes</TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Custom Color Scheme
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
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(currentScheme).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-2">
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
              <div className="p-6 rounded-lg border" style={{
                backgroundColor: currentScheme.background,
                borderColor: currentScheme.border
              }}>
                <div className="space-y-4">
                  <h3 style={{ color: currentScheme.text }} className="text-lg font-semibold">
                    Color Preview
                  </h3>
                  <p style={{ color: currentScheme.textSecondary }} className="text-sm">
                    This is how your colors will look on your website.
                  </p>
                  <div className="flex gap-3 flex-wrap">
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
                    className="p-4 rounded"
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

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preset Color Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {presetSchemes.map((preset, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: preset.scheme.background,
                      borderColor: preset.scheme.border
                    }}
                    onClick={() => applyPreset(preset.scheme)}
                  >
                    <h4 style={{ color: preset.scheme.text }} className="font-medium mb-3">
                      {preset.name}
                    </h4>
                    <div className="flex gap-2 mb-3">
                      {Object.entries(preset.scheme).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded border"
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
                      Apply Scheme
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4 border-t">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Apply to Website
        </Button>
      </div>
    </div>
  );
};

export default ColorSchemeEditor;
