"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoGenerationErrorProps {
  taskId?: number;
}

export function VideoGenerationError({ taskId }: VideoGenerationErrorProps) {
  const t = useTranslations("VideoCreation");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Trigger shake animation on mount
    setShake(true);
    const timer = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center p-8 rounded-2xl">
      <div className="w-full max-w-md space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
            <div className="relative bg-gray-900 border border-red-500/30 rounded-full p-6 shadow-2xl">
              <div className="relative">
                <AlertTriangle className="w-12 h-12 text-red-400" />
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                  <X className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        <div className="text-center space-y-4">
          <div className={`space-y-2 ${shake ? "animate-shake" : ""}`}>
            <h2 className="text-2xl font-semibold text-white">{t("error.title")}</h2>
            <p className="text-red-400 font-medium">{t("error.description")}</p>
          </div>

          <div className="pt-2">
            <p className="text-gray-400 text-sm">{t("error.tryAgain")}</p>
          </div>
        </div>

        {/* Task Info */}
        {taskId && (
          <div className="text-center text-xs text-gray-500">
            Task ID: {taskId}
          </div>
        )}

        {/* Status indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {t("error.generationFailed")}
          </div>
        </div>

        {/* Animated warning indicators */}
        <div className="flex justify-center opacity-40">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-6 bg-red-500/60 rounded-sm animate-pulse border border-red-400/30"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "1s",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}