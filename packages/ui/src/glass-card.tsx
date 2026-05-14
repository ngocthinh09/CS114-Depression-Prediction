import * as React from "react";
import { cn } from "./utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "normal" | "strong";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "normal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          intensity === "normal" ? "glass-card" : "glass-card-strong",
          "rounded-2xl transition-all duration-300",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
