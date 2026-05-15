import React from "react";
import { cn } from "@repo/ui/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn("max-w-3xl mx-auto w-full", className)}>
      <div className="flex justify-between items-center mb-xs font-label-sm text-label-sm text-on-surface-variant">
        <span>Survey Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-tertiary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}
