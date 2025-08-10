"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X, Play, Upload, Sparkles } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface VideoTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoTutorial({ isOpen, onClose }: VideoTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Video Creation",
      description: "Create stunning AI-powered videos in just a few simple steps. Let's get started with a quick tutorial!",
      icon: <Play className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Enter Your Prompt",
      description: "Type your creative prompt in the chat bar at the bottom. Be descriptive about what you want to see in your video.",
      icon: <Sparkles className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Choose Your Style",
      description: "Select from various AI models and styles to match your vision. You can choose between different artistic styles and characters.",
      icon: <Upload className="w-8 h-8 text-green-500" />
    },
    {
      title: "Generate & Watch",
      description: "Click generate and watch your video come to life! Your videos will appear in the gallery above. You can download, share, or create variations.",
      icon: <Play className="w-8 h-8 text-orange-500" />
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Mark tutorial as seen in localStorage
    localStorage.setItem('videoTutorialSeen', 'true');
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Video Creation Tutorial</DialogTitle>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {tutorialSteps[currentStep].icon}
            <div>
              <h2 className="text-lg font-semibold">
                {tutorialSteps[currentStep].title}
              </h2>
              <p className="text-white/80 text-sm">
                Step {currentStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-6">
            {tutorialSteps[currentStep].description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip Tutorial
            </button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              
              {currentStep < tutorialSteps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleClose}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}