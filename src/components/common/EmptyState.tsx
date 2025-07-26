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
    <div className={`text-center py-12 text-muted-foreground ${className}`}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p className="text-base">{title}</p>
      {description && (
        <p className="text-sm mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
