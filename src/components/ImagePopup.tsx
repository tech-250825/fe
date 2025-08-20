"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export default function ImagePopup({
  isOpen,
  onClose,
  imageSrc,
}: ImagePopupProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !imageSrc) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    onClose();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with shadow effect - clickable */}
      <div className="absolute inset-0 bg-black/90" onClick={handleBackgroundClick} />
      
      <div className="relative z-10 flex items-center justify-center h-full w-full p-8" onClick={handleBackgroundClick}>
        <img
          src={imageSrc}
          alt="Full size image"
          className="w-auto h-auto object-contain shadow-2xl"
          style={{ 
            maxHeight: 'calc(100vh - 4rem)', 
            maxWidth: 'calc(100vw - 4rem)'
          }}
          loading="lazy"
          onClick={handleImageClick}
        />
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 rounded-full p-2 bg-black/70 text-white hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}