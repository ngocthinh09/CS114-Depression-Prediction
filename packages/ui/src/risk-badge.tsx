import * as React from "react";
import { cn } from "./utils";

export type RiskLevel = "low" | "mild" | "moderate" | "severe";

interface RiskBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: RiskLevel;
}

export const RiskBadge = ({ level, className, ...props }: RiskBadgeProps) => {
  const configs = {
    low: {
      label: "Low Risk",
      classes: "bg-tertiary-container text-on-tertiary-container",
    },
    mild: {
      label: "Mild Stress",
      classes: "bg-primary-container text-on-primary-container",
    },
    moderate: {
      label: "Moderate",
      classes: "bg-secondary-container text-on-secondary-container",
    },
    severe: {
      label: "Severe",
      classes: "bg-error-container text-on-error-container font-bold",
    },
  };

  const config = configs[level];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-label-sm uppercase tracking-wider",
        config.classes,
        className
      )}
      {...props}
    >
      {config.label}
    </div>
  );
};
