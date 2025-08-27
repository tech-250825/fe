"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { config } from "@/config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-balance">
              Sign in with your Google account
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            className="w-full h-12 text-base"
            variant="default"
            onClick={() => {
              // Get redirect URL from query params or use current URL
              const urlParams = new URLSearchParams(window.location.search);
              const redirectUrl = urlParams.get('redirect') || window.location.href;
              
              // Encode the redirect URL
              const encodedRedirect = encodeURIComponent(redirectUrl);
              
              onClose();
              
              window.location.assign(
                `${config.apiUrl}/oauth2/authorization/google?redirect_uri=${encodedRedirect}`,
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-3"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-muted-foreground text-center text-xs text-balance">
            By clicking continue, you agree to our{" "}
            <a href="/terms-of-service" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}