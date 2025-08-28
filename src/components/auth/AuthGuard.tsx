"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/login-modal";
import { useTranslations } from "next-intl";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function AuthGuard({ children, fallbackMessage }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const t = useTranslations();

  // 아직 로그인 여부 확인 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!isLoggedIn) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">
            {fallbackMessage || t("loginRequired")}
          </p>
        </div>
        <LoginModal
          isOpen={true}
          onClose={() => {}}
        />
      </>
    );
  }

  return <>{children}</>;
}