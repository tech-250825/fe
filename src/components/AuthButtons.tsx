import React from "react";
import { User, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // 위에서 만든 커스텀 훅

interface AuthButtonsProps {
  variant?: "light" | "dark";
  showTryFreeButton?: boolean;
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  variant = "light",
  showTryFreeButton = true,
  className = "",
}) => {
  const { isLoggedIn, userName, handleLogout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="w-16 h-8 bg-gray-300 animate-pulse rounded"></div>
        <div className="w-20 h-8 bg-gray-300 animate-pulse rounded-full"></div>
      </div>
    );
  }

  const textColor = variant === "light" ? "text-gray-900" : "text-gray-300";
  const hoverColor =
    variant === "light" ? "hover:text-gray-700" : "hover:text-white";

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {isLoggedIn ? (
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${textColor}`}>
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-1 ${textColor} ${hoverColor} transition-colors`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <a
          href="/login"
          className={`${textColor} ${hoverColor} transition-colors`}
        >
          Log In
        </a>
      )}

      {showTryFreeButton && (
        <a
          href="/home"
          className={`${
            variant === "light"
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          } px-5 py-2 rounded-full transition-colors flex items-center`}
        >
          Try for Free <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      )}
    </div>
  );
};

export default AuthButtons;
