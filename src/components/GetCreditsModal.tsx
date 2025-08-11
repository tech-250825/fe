"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface GetCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetCreditsModal({
  isOpen,
  onClose,
}: GetCreditsModalProps) {
  const t = useTranslations("GetCredits");
  const locale = useLocale();

  const handleGetCredit = () => {
    // Redirect to different Google Forms based on locale (same as CreditInsufficientModal)
    const surveyUrls = {
      ko: "https://docs.google.com/forms/d/e/1FAIpQLSekEeMmQLpgY7FHhcjYHsSjOrFMrYx6rn1suceGfRzwPBaORA/viewform",
      en: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog",
      ja: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog", // Japanese -> English survey
      zh: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog" // Chinese -> English survey
    };

    const surveyUrl = surveyUrls[locale as keyof typeof surveyUrls] || surveyUrls.en;
    window.open(surveyUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header with gift icon */}
        <div className="relative bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Get Credits
              </DialogTitle>
              <p className="text-white/90 text-sm">
                Answer a survey to get free credits
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Card className="border-dashed border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Free Credits Available
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Complete a quick survey to help us improve our service and get free credits to create more content!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Quick 2-minute survey
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Get free credits instantly
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Help improve our service
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-0">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleGetCredit}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              <Gift className="w-4 h-4 mr-2" />
              Get Credits
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}