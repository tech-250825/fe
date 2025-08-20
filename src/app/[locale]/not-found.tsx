"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary/20 leading-none">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("title")}
            </h2>
            <p className="text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>

        {/* Search-like visual element */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="absolute top-12 right-2 w-6 h-6 border-4 border-muted rounded-full bg-background transform rotate-45"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t("goHome")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("goBack")}
            </button>
          </Button>
        </div>

        {/* Brand */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t("returnTo")}{" "}
            <Link 
              href="/" 
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              Hoit
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}