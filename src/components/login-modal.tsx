"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "@/components/login-form";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-muted">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}