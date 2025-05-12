
import { useState } from "react";
import TemplateSelection from "./TemplateSelection";
import BuilderTutorial from "./BuilderTutorial";

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

  const handleTemplateComplete = () => {
    setCurrentStep(OnboardingStep.TUTORIAL);
  };

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
          onComplete={onComplete} 
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
