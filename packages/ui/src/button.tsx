"use client";

import * as React from "react";
import { cn } from "./utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary-outlined" | "ghost" | "pill";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
      "secondary-outlined":
        "border border-outline-variant text-primary bg-transparent hover:bg-surface-container-low",
      ghost: "text-primary bg-transparent hover:bg-surface-container",
      pill: "rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low px-6",
    };

    const sizes = {
      sm: "h-9 px-3 text-label-sm",
      md: "h-12 px-6 text-label-md",
      lg: "h-14 px-8 text-label-md font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
