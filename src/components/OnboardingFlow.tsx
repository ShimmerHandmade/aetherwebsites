
import { useState, useEffect } from "react";
import TemplateSelection from "./TemplateSelection";
import BuilderTutorial from "./BuilderTutorial";
import { toast } from "sonner";

interface OnboardingFlowProps {
  websiteId: string;
  onComplete: () => void;
}

enum OnboardingStep {
  TEMPLATES,
  TUTORIAL
}

const OnboardingFlow = ({ websiteId, onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.TEMPLATES);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle smooth transition between steps
  const handleTemplateComplete = () => {
    setIsTransitioning(true);
    
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setCurrentStep(OnboardingStep.TUTORIAL);
      setIsTransitioning(false);
    }, 500);
    
    // Show toast for better UX
    toast.success("Template selected! Loading tutorial...");
  };
  
  // Handle completion with smooth transition to builder
  const handleTutorialComplete = () => {
    setIsTransitioning(true);
    
    // Add a small delay before triggering onComplete
    setTimeout(() => {
      onComplete();
    }, 500);
    
    // Show toast for better UX
    toast.success("Onboarding complete! Loading builder...");
  };

  // Show loading indicator during transitions
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading next step...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === OnboardingStep.TEMPLATES && (
        <TemplateSelection 
          websiteId={websiteId} 
          onComplete={handleTemplateComplete} 
        />
      )}
      
      {currentStep === OnboardingStep.TUTORIAL && (
        <BuilderTutorial 
          websiteId={websiteId} 
          onComplete={handleTutorialComplete} 
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
