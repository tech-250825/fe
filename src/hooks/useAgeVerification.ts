"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useAgeVerification = () => {
  const { userProfile, isLoggedIn, fetchProfile } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userProfile) {
      // If user role is ADMIN, they're already verified
      if (userProfile.role === "ADMIN") {
        setIsVerified(true);
        setShowVerificationDialog(false);
      } else {
        // If user role is USER or undefined, show verification dialog
        setIsVerified(false);
        setShowVerificationDialog(true);
      }
    } else {
      // Not logged in
      setIsVerified(false);
      setShowVerificationDialog(false);
    }
  }, [isLoggedIn, userProfile]);

  const handleVerificationSuccess = async () => {
    // Refresh user profile to get updated role
    await fetchProfile();
    setIsVerified(true);
    setShowVerificationDialog(false);
  };

  const closeVerificationDialog = () => {
    setShowVerificationDialog(false);
  };

  return {
    showVerificationDialog,
    isVerified,
    handleVerificationSuccess,
    closeVerificationDialog,
  };
};