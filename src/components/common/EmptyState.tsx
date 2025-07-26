import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 text-gray-500 ${className}`}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p className="text-base">{title}</p>
      {description && (
        <p className="text-sm mt-2 text-gray-400">{description}</p>
      )}
    </div>
  );
}
