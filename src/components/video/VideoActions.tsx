import React from "react";
import { RotateCcw, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoActionsProps {
  onShowMore?: () => void;
  onBrainstorm?: () => void;
  onReply?: () => void;
  onMore?: () => void;
  className?: string;
}

export function VideoActions({
  onShowMore,
  onBrainstorm,
  onReply,
  onMore,
  className = "",
}: VideoActionsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        onClick={onShowMore}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Show More
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        onClick={onBrainstorm}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Brainstorm
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        onClick={onReply}
      >
        💬 Reply
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={onMore}
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
  );
}
