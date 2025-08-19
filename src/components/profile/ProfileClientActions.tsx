"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { config } from "@/config";
import { useTranslations } from "next-intl";

export const BuyCreditsButton: React.FC = () => {
  const t = useTranslations("Profile");

  const handleBuyCredits = () => {
    toast.info(t("messages.creditsPending"));
  };

  return (
    <Button onClick={handleBuyCredits} className="bg-blue-600 hover:bg-blue-700">
      <CreditCard className="mr-2 size-4" />
      {t("credit.purchase")}
    </Button>
  );
};

export const LogoutButton: React.FC = () => {
  const t = useTranslations("Profile");
  const { handleLogout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 bg-transparent"
    >
      {t("account.logout.button")}
    </Button>
  );
};

interface WithdrawButtonProps {
  userId: number;
}

export const WithdrawButton: React.FC<WithdrawButtonProps> = ({ userId }) => {
  const t = useTranslations("Profile");
  const { handleLogout: authLogout } = useAuth();

  const handleWithdraw = async () => {
    const confirmed = window.confirm(t("account.withdraw.confirm"));
    if (!confirmed) return;

    try {
      const response = await fetch(`${config.apiUrl}/api/user/withdraw`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to withdraw");
      }

      toast.success(t("messages.withdrawSuccess"));
      authLogout();
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error(t("messages.withdrawError"));
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleWithdraw}
      className="bg-red-600 hover:bg-red-700"
    >
      {t("account.withdraw.button")}
    </Button>
  );
};