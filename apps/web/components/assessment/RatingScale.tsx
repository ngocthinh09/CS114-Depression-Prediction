import React from "react";
import { cn } from "@repo/ui/utils";

interface RatingScaleProps {
  name: string;
  value: number | "";
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

export function RatingScale({
  name,
  value,
  onChange,
  minLabel = "Low",
  maxLabel = "High",
  className,
}: RatingScaleProps) {
  const points = [1, 2, 3, 4, 5];

  return (
    <div className={cn("flex items-center justify-center w-full gap-2 md:gap-4 max-w-xl mx-auto mt-2", className)}>
      <span className="font-label-sm text-label-sm text-on-surface-variant text-right flex-1 wrap-break-word leading-tight">
        {minLabel}
      </span>
      <div className="flex gap-1 sm:gap-2 justify-center shrink-0">
        {points.map((point) => {
          const isChecked = value === point;
          return (
            <label key={point} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={point}
                checked={isChecked}
                onChange={() => onChange(point)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-label-md text-label-md transition-all",
                  isChecked
                    ? "bg-secondary text-on-secondary border-secondary scale-110 shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:scale-105"
                )}
              >
                {point}
              </div>
            </label>
          );
        })}
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant text-left flex-1 wrap-break-word leading-tight">
        {maxLabel}
      </span>
    </div>
  );
}
