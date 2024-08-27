"use client";

import { useState } from "react";

interface OnboardingStep {
  title: string;
  content: string;
}

interface UserOnboardingProps {
  steps: OnboardingStep[];
  onComplete: () => void;
}

export default function UserOnboarding({ steps, onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        <p className="mb-6">{steps[currentStep].content}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
