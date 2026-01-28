"use client";

import { Sparkles, OctagonX } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  enabled: boolean;
  className?: string;
}

/**
 * Badge per lo stato AI & Transcription
 * Design basato su Figma: node 194-3891
 */
export function AIBadge({ enabled, className }: AIBadgeProps) {
  if (enabled) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold",
          "border-[#15803D] bg-[#DCFCE7] text-[#15803D]",
          className
        )}
      >
        <Sparkles className="size-3" strokeWidth={1.25} />
        Enabled
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold",
        "border-[#F87171] bg-[#FEF2F2] text-[#F87171]",
        className
      )}
    >
      <OctagonX className="size-3" strokeWidth={1.25} />
      Disabled
    </span>
  );
}
