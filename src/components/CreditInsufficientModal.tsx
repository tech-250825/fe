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
import { AlertTriangle, Gift, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreditInsufficientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditInsufficientModal({
  isOpen,
  onClose,
}: CreditInsufficientModalProps) {
  const t = useTranslations("CreditInsufficient");

  const handleGetCredit = () => {
    // 설문조사 링크로 이동하거나 크레딧 구매 페이지로 이동
    // TODO: 실제 설문조사 링크나 크레딧 구매 페이지 URL로 변경
    window.open("https://forms.gle/your-survey-link", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header with warning icon */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {t("title")}
              </DialogTitle>
              <p className="text-white/90 text-sm">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Card className="border-dashed border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-full flex-shrink-0">
                  <Gift className="w-5 h-5 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    {t("surveyTitle")}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t("surveyDescription")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {t("benefits.item1")}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {t("benefits.item2")}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              {t("benefits.item3")}
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
              {t("buttons.close")}
            </Button>
            <Button
              onClick={handleGetCredit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Gift className="w-4 h-4 mr-2" />
              {t("buttons.getCredit")}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}