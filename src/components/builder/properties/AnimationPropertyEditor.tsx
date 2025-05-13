
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AnimationPropertyEditorProps {
  element: BuilderElement;
  onPropertyChange: (property: string, value: any) => void;
  onContentChange: (value: string) => void;
}

const AnimationPropertyEditor: React.FC<AnimationPropertyEditorProps> = ({
  element,
  onPropertyChange,
  onContentChange,
}) => {
  const { isPremium, isEnterprise } = usePlan();
  const props = element.props || {};
  
  // Check if this user has access to this element
  const isEnterpriseElement = props.animationType === 'enterprise';
  const isPremiumElement = props.animationType === 'premium';
  const hasAccess = 
    (isPremiumElement && (isPremium || isEnterprise)) || 
    (isEnterpriseElement && isEnterprise) ||
    (!isPremiumElement && !isEnterpriseElement);

  return (
    <div className="space-y-4">
      {!hasAccess && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This is a {isEnterpriseElement ? 'Enterprise' : 'Premium'} feature. Upgrade your plan to use it.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="content">Content</Label>
        <TextArea
          id="content"
          value={props.content || element.content || ""}
          onChange={(e) => onPropertyChange("content", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="animation-effect">Animation Effect</Label>
        <Select
          value={props.animationEffect || "fade-in"}
          onValueChange={(value) => onPropertyChange("animationEffect", value)}
          disabled={!hasAccess}
        >
          <SelectTrigger id="animation-effect">
            <SelectValue placeholder="Select animation effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade-in">Fade In</SelectItem>
            <SelectItem value="slide-in-right">Slide In</SelectItem>
            <SelectItem value="scale-in">Scale In</SelectItem>
            {element.type === 'particlesBackground' && (
              <SelectItem value="particles">Particles</SelectItem>
            )}
            {element.type === 'scrollReveal' && (
              <SelectItem value="scroll-reveal">Scroll Reveal</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {element.type === 'particlesBackground' && (
        <>
          <div>
            <Label htmlFor="particle-color">Particle Color</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                id="particle-color"
                value={props.particleColor || "#4f46e5"}
                onChange={(e) => onPropertyChange("particleColor", e.target.value)}
                className="w-20"
                disabled={!hasAccess}
              />
              <Input
                type="text"
                value={props.particleColor || "#4f46e5"}
                onChange={(e) => onPropertyChange("particleColor", e.target.value)}
                disabled={!hasAccess}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="particle-count">Particle Count</Label>
            <Input
              type="number"
              id="particle-count"
              value={props.particleCount || 50}
              onChange={(e) => onPropertyChange("particleCount", parseInt(e.target.value))}
              min={10}
              max={200}
              disabled={!hasAccess}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnimationPropertyEditor;
