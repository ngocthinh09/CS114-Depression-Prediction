import React from "react";
import { cn } from "@repo/ui/utils";

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioChipGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioChipGroup({
  name,
  options,
  value,
  onChange,
  className,
}: RadioChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-sm", className)}>
      {options.map((option) => {
        const isChecked = value === option.value;
        return (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <div
              className={cn(
                "px-4 py-2 rounded-full border border-outline-variant font-label-md text-label-md transition-colors",
                isChecked
                  ? "bg-primary text-on-primary border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              {option.label}
            </div>
          </label>
        );
      })}
    </div>
  );
}
