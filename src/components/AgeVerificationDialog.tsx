"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { config } from "@/config";
import { api } from "@/lib/auth/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AgeVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AgeVerificationDialog({
  isOpen,
  onClose,
  onVerified,
}: AgeVerificationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUnderage, setShowUnderage] = useState(false);
  const router = useRouter();

  const handleAdultConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`${config.apiUrl}/api/user/verify19`, {});

      if (response.ok) {
        onVerified();
        onClose();
      } else {
        console.error("Age verification failed");
        // Handle error - maybe show an error message
      }
    } catch (error) {
      console.error("Age verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotAdult = () => {
    setShowUnderage(true);
  };

  const handleUnderageOk = () => {
    setShowUnderage(false);
    onClose();
    router.push("/home");
  };

  if (showUnderage) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Access Restricted
            </DialogTitle>
            <DialogDescription>
              This content is restricted to users 19 years of age and older. 
              You will be redirected to the home page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleUnderageOk} className="w-full">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Age Verification Required</DialogTitle>
          <DialogDescription>
            This content is intended for adults only. Are you 19 years of age or older?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleAdultConfirm}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Yes, I am 19 or older"}
          </Button>
          <Button 
            onClick={handleNotAdult}
            variant="outline"
            className="w-full"
          >
            No, I am under 19
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}