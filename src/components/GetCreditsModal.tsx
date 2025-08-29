"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, CreditCard, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/login-modal";
import { config } from "@/config";

interface GetCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  bonus?: number;
  popular?: boolean;
}

const creditPackages: CreditPackage[] = [
  {
    id: "package_500",
    credits: 500,
    price: 5,
    currency: "USDT"
  },
  {
    id: "package_1100", 
    credits: 1100,
    price: 10,
    currency: "USDT",
    bonus: 100,
    popular: true
  }
];

export function GetCreditsModal({
  isOpen,
  onClose,
}: GetCreditsModalProps) {
  const { isLoggedIn, fetchProfile } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentTrackId, setPaymentTrackId] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  // const handleGetCredit = () => {
  //   // Redirect to different Google Forms based on locale (same as CreditInsufficientModal)
  //   const surveyUrls = {
  //     ko: "https://docs.google.com/forms/d/e/1FAIpQLSekEeMmQLpgY7FHhcjYHsSjOrFMrYx6rn1suceGfRzwPBaORA/viewform",
  //     en: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog",
  //     ja: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog", // Japanese -> English survey
  //     zh: "https://docs.google.com/forms/d/e/1FAIpQLSd397OfDdxatcxvscResZKCpMkxFzVUKMCp5-5AWM3lqlaHUg/viewform?usp=dialog" // Chinese -> English survey
  //   };

  //   const surveyUrl = surveyUrls[locale as keyof typeof surveyUrls] || surveyUrls.en;
  //   window.open(surveyUrl, "_blank");
  // };

  const handlePurchaseCredits = async (creditPackage: CreditPackage) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setSelectedPackage(creditPackage);
    setIsProcessing(true);

    try {
      // Call backend invoice creation API
      const response = await fetch(`${config.apiUrl}/api/oxapay/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: creditPackage.price,
          currency: creditPackage.currency,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200 && data.data?.success) {
        // API returns payLink and trackId in data field
        const { payLink, trackId } = data.data;
        
        window.open(payLink, '_self');
        
      } else {
        throw new Error(data.data?.message || data.message || 'Failed to create payment invoice');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!paymentTrackId) return;

    try {
      setIsProcessing(true);
      const response = await fetch(`${config.apiUrl}/api/oxapay/status/${paymentTrackId}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.statusCode === 200 && data.data?.success) {
        const paymentInfo = data.data.paymentInfo;
        if (paymentInfo?.status === 'completed') {
          alert('Payment completed successfully! Credits have been added to your account.');
          localStorage.removeItem('pendingPaymentTrackId');
          localStorage.removeItem('pendingPaymentCredits');
          
          // Update user profile to reflect new credit balance
          await fetchProfile();
          
          onClose(); // Close the modal

          // ✅ 결제 성공 시 홈으로 이동
          // window.location.href = "/home";
        } else {
          alert(`Payment status: ${paymentInfo?.status || 'pending'}`);
        }
      } else {
        alert(data.data?.message || 'Failed to check payment status');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      alert('Failed to check payment status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Purchase Credits
                </DialogTitle>
              </div>
            </div>
          </div>

          <div className="p-6">
              <>
                {/* Purchase Credits Section */}
                <div className="space-y-4">               
                  <div className="grid gap-4 md:grid-cols-2">
                    {creditPackages.map((pkg) => (
                      <Card 
                        key={pkg.id} 
                        className={`relative cursor-pointer transition-all hover:shadow-lg ${
                          pkg.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200'
                        }`}
                        onClick={() => handlePurchaseCredits(pkg)}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <CardContent className="p-6 text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                            <Coins className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">
                            {pkg.credits.toLocaleString()}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Credits
                            {pkg.bonus && (
                              <span className="text-green-600 font-medium ml-1">
                                (+{pkg.bonus} bonus!)
                              </span>
                            )}
                          </p>
                          <div className="text-3xl font-bold text-blue-600 mb-4">
                            ${pkg.price}
                          </div>
                          <Button 
                            className="w-full"
                            disabled={isProcessing && selectedPackage?.id === pkg.id}
                          >
                            {isProcessing && selectedPackage?.id === pkg.id ? (
                              'Processing...'
                            ) : !isLoggedIn ? (
                              'Login to Purchase'
                            ) : (
                              'Purchase Now'
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-900">
                          Secure Cryptocurrency Payment
                        </p>
                        <p className="text-xs text-blue-700">
                          Pay with Bitcoin, Ethereum, USDT, or other cryptocurrencies through our secure payment partner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
