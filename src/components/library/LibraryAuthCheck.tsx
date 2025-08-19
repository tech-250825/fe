"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/login-modal";
import { useTranslations } from "next-intl";

interface LibraryAuthCheckProps {
  children: React.ReactNode;
}

export const LibraryAuthCheck: React.FC<LibraryAuthCheckProps> = ({ children }) => {
  const t = useTranslations("Library");
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">{t("loginRequired")}</p>
        </div>
        <LoginModal
          isOpen={true}
          onClose={() => {}}
        />
      </>
    );
  }

  return <>{children}</>;
};