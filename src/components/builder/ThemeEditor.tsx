import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Save, RotateCcw, Eye, Wand2, Type, Layout } from "lucide-react";
import { toast } from "sonner";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ThemeTypography {
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  headingSize: string;
  lineHeight: string;
}

interface ThemeSpacing {
  containerPadding: string;
  sectionSpacing: string;
  elementSpacing: string;
  borderRadius: string;
}

interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
}

interface ThemeEditorProps {
  onSave?: (theme: Theme) => void;
  onClose?: () => void;
  initialTheme?: Theme;
  activeSection?: string; // Add this to control which section is shown
}

const ThemeEditor: React.FC<ThemeEditorProps> = ({ onSave, onClose, initialTheme, activeSection = "colors" }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    initialTheme || {
      name: "Custom Theme",
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#06b6d4",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0"
      },
      typography: {
        fontFamily: "Inter",
        headingFont: "Inter",
        fontSize: "16",
        headingSize: "32",
        lineHeight: "1.5"
      },
      spacing: {
        containerPadding: "1rem",
        sectionSpacing: "4rem",
        elementSpacing: "1rem",
        borderRadius: "0.5rem"
      }
    }
  );

  const [previewMode, setPreviewMode] = useState(false);

  // Font options
  const fontOptions = [
    "Inter", "Arial", "Helvetica", "Georgia", "Times New Roman",
    "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
    "Playfair Display", "Merriweather", "Source Sans Pro"
  ];

  // Preset themes
  const presetThemes: Theme[] = [
    {
      name: "Modern Blue",
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#3b82f6",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0"
      },
      typography: {
        fontFamily: "Inter",
        headingFont: "Inter",
        fontSize: "16",
        headingSize: "32",
        lineHeight: "1.6"
      },
      spacing: {
        containerPadding: "1.5rem",
        sectionSpacing: "4rem",
        elementSpacing: "1.5rem",
        borderRadius: "0.5rem"
      }
    },
    {
      name: "Elegant Purple",
      colors: {
        primary: "#7c3aed",
        secondary: "#8b5cf6",
        accent: "#a855f7",
        background: "#ffffff",
        surface: "#faf5ff",
        text: "#581c87",
        textSecondary: "#7c3aed",
        border: "#d8b4fe"
      },
      typography: {
        fontFamily: "Playfair Display",
        headingFont: "Playfair Display",
        fontSize: "16",
        headingSize: "36",
        lineHeight: "1.7"
      },
      spacing: {
        containerPadding: "2rem",
        sectionSpacing: "5rem",
        elementSpacing: "2rem",
        borderRadius: "0.75rem"
      }
    },
    {
      name: "Minimalist Gray",
      colors: {
        primary: "#374151",
        secondary: "#4b5563",
        accent: "#6b7280",
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        textSecondary: "#6b7280",
        border: "#e5e7eb"
      },
      typography: {
        fontFamily: "Inter",
        headingFont: "Inter",
        fontSize: "15",
        headingSize: "28",
        lineHeight: "1.5"
      },
      spacing: {
        containerPadding: "1rem",
        sectionSpacing: "3rem",
        elementSpacing: "1rem",
        borderRadius: "0.25rem"
      }
    }
  ];

  // Apply theme to canvas
  const applyThemeToCanvas = (theme: Theme) => {
    const canvasContainer = document.querySelector('[data-canvas-container="true"]');
    
    if (canvasContainer) {
      const element = canvasContainer as HTMLElement;
      
      // Apply colors
      element.style.setProperty('--theme-primary', theme.colors.primary);
      element.style.setProperty('--theme-secondary', theme.colors.secondary);
      element.style.setProperty('--theme-accent', theme.colors.accent);
      element.style.setProperty('--theme-background', theme.colors.background);
      element.style.setProperty('--theme-surface', theme.colors.surface);
      element.style.setProperty('--theme-text', theme.colors.text);
      element.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
      element.style.setProperty('--theme-border', theme.colors.border);
      
      // Apply typography
      element.style.setProperty('--theme-font-family', theme.typography.fontFamily);
      element.style.setProperty('--theme-heading-font', theme.typography.headingFont);
      element.style.setProperty('--theme-font-size', `${theme.typography.fontSize}px`);
      element.style.setProperty('--theme-heading-size', `${theme.typography.headingSize}px`);
      element.style.setProperty('--theme-line-height', theme.typography.lineHeight);
      
      // Apply spacing
      element.style.setProperty('--theme-container-padding', theme.spacing.containerPadding);
      element.style.setProperty('--theme-section-spacing', theme.spacing.sectionSpacing);
      element.style.setProperty('--theme-element-spacing', theme.spacing.elementSpacing);
      element.style.setProperty('--theme-border-radius', theme.spacing.borderRadius);
      
      console.log("Theme applied to canvas:", theme.name);
    }
  };

  // Handle theme changes - now properly typed
  const updateTheme = (section: keyof Theme, key: string, value: string) => {
    if (section === 'name') {
      setCurrentTheme(prev => ({ ...prev, name: value }));
      return;
    }

    const sectionData = currentTheme[section];
    if (typeof sectionData === 'object' && sectionData !== null) {
      const newTheme = {
        ...currentTheme,
        [section]: {
          ...sectionData,
          [key]: value
        }
      };
      setCurrentTheme(newTheme);
      
      if (previewMode) {
        applyThemeToCanvas(newTheme);
      }
    }
  };

  // Apply preset theme
  const applyPreset = (preset: Theme) => {
    setCurrentTheme(preset);
    if (previewMode) {
      applyThemeToCanvas(preset);
    }
    toast.success(`Applied "${preset.name}" theme`);
  };

  // Save theme
  const handleSave = () => {
    applyThemeToCanvas(currentTheme);
    if (onSave) {
      onSave(currentTheme);
    }
    toast.success("Theme saved successfully!");
  };

  // Reset theme
  const handleReset = () => {
    const defaultTheme = presetThemes[0];
    setCurrentTheme(defaultTheme);
    if (previewMode) {
      applyThemeToCanvas(defaultTheme);
    }
    toast.success("Theme reset to default");
  };

  // Toggle preview
  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      applyThemeToCanvas(currentTheme);
      toast.success("Preview mode enabled");
    } else {
      toast.success("Preview mode disabled");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "colors":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => updateTheme("colors", key, e.target.value)}
                        className="w-12 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => updateTheme("colors", key, e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Preview */}
              <div className="p-6 rounded-lg border" style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.border
              }}>
                <div className="space-y-4">
                  <h3 style={{ color: currentTheme.colors.text }} className="text-lg font-semibold">
                    Theme Preview
                  </h3>
                  <p style={{ color: currentTheme.colors.textSecondary }} className="text-sm">
                    This shows how your theme colors will look together.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Button style={{ backgroundColor: currentTheme.colors.primary }} className="text-white">
                      Primary
                    </Button>
                    <Button 
                      variant="outline" 
                      style={{ 
                        borderColor: currentTheme.colors.secondary,
                        color: currentTheme.colors.secondary
                      }}
                    >
                      Secondary
                    </Button>
                    <Badge style={{ backgroundColor: currentTheme.colors.accent }} className="text-white">
                      Accent
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "typography":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select 
                    value={currentTheme.typography.fontFamily}
                    onValueChange={(value) => updateTheme("typography", "fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select 
                    value={currentTheme.typography.headingFont}
                    onValueChange={(value) => updateTheme("typography", "headingFont", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Font Size (px)</Label>
                  <Input
                    type="number"
                    value={currentTheme.typography.fontSize}
                    onChange={(e) => updateTheme("typography", "fontSize", e.target.value)}
                    min="12"
                    max="24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Heading Size (px)</Label>
                  <Input
                    type="number"
                    value={currentTheme.typography.headingSize}
                    onChange={(e) => updateTheme("typography", "headingSize", e.target.value)}
                    min="24"
                    max="48"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <Select 
                    value={currentTheme.typography.lineHeight}
                    onValueChange={(value) => updateTheme("typography", "lineHeight", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.2">Tight (1.2)</SelectItem>
                      <SelectItem value="1.4">Snug (1.4)</SelectItem>
                      <SelectItem value="1.5">Normal (1.5)</SelectItem>
                      <SelectItem value="1.6">Relaxed (1.6)</SelectItem>
                      <SelectItem value="1.8">Loose (1.8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Typography Preview */}
              <div className="p-6 border rounded-lg" style={{
                fontFamily: currentTheme.typography.fontFamily,
                fontSize: `${currentTheme.typography.fontSize}px`,
                lineHeight: currentTheme.typography.lineHeight,
                color: currentTheme.colors.text
              }}>
                <h3 style={{ 
                  fontFamily: currentTheme.typography.headingFont,
                  fontSize: `${currentTheme.typography.headingSize}px`,
                  marginBottom: "1rem"
                }}>
                  Typography Preview
                </h3>
                <p>This is how your body text will appear with the selected typography settings. The font family, size, and line height all contribute to the overall readability and style of your website.</p>
              </div>
            </CardContent>
          </Card>
        );

      case "spacing":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Spacing & Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Container Padding</Label>
                  <Select 
                    value={currentTheme.spacing.containerPadding}
                    onValueChange={(value) => updateTheme("spacing", "containerPadding", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5rem">Small (0.5rem)</SelectItem>
                      <SelectItem value="1rem">Medium (1rem)</SelectItem>
                      <SelectItem value="1.5rem">Large (1.5rem)</SelectItem>
                      <SelectItem value="2rem">Extra Large (2rem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section Spacing</Label>
                  <Select 
                    value={currentTheme.spacing.sectionSpacing}
                    onValueChange={(value) => updateTheme("spacing", "sectionSpacing", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2rem">Small (2rem)</SelectItem>
                      <SelectItem value="3rem">Medium (3rem)</SelectItem>
                      <SelectItem value="4rem">Large (4rem)</SelectItem>
                      <SelectItem value="5rem">Extra Large (5rem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Element Spacing</Label>
                  <Select 
                    value={currentTheme.spacing.elementSpacing}
                    onValueChange={(value) => updateTheme("spacing", "elementSpacing", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5rem">Tight (0.5rem)</SelectItem>
                      <SelectItem value="1rem">Normal (1rem)</SelectItem>
                      <SelectItem value="1.5rem">Relaxed (1.5rem)</SelectItem>
                      <SelectItem value="2rem">Loose (2rem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Select 
                    value={currentTheme.spacing.borderRadius}
                    onValueChange={(value) => updateTheme("spacing", "borderRadius", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="0.25rem">Small (0.25rem)</SelectItem>
                      <SelectItem value="0.5rem">Medium (0.5rem)</SelectItem>
                      <SelectItem value="0.75rem">Large (0.75rem)</SelectItem>
                      <SelectItem value="1rem">Extra Large (1rem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "presets":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Preset Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presetThemes.map((preset, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: preset.colors.background,
                      borderColor: preset.colors.border
                    }}
                    onClick={() => applyPreset(preset)}
                  >
                    <h4 style={{ color: preset.colors.text }} className="font-medium mb-4">
                      {preset.name}
                    </h4>
                    <div className="flex gap-2 mb-4">
                      {Object.entries(preset.colors).slice(0, 4).map(([key, color]) => (
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
                      style={{ backgroundColor: preset.colors.primary }}
                      className="text-white w-full"
                    >
                      Apply Theme
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Theme Editor</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={togglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Previewing" : "Preview"}
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {renderContent()}

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 pt-6 border-t">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Theme
        </Button>
      </div>
    </div>
  );
};

export default ThemeEditor;
