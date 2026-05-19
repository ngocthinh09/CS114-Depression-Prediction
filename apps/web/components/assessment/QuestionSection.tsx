import React from "react";
import { cn } from "@repo/ui/utils";

interface QuestionSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  bgColorClass?: string; // e.g., 'bg-primary-container/20'
}

export function QuestionSection({
  title,
  icon,
  children,
  className,
  bgColorClass = "bg-surface-container-lowest",
}: QuestionSectionProps) {
  return (
    <section className={cn("glass-card rounded-xl p-md md:p-lg", bgColorClass, className)}>
      <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-xs">
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        {title}
      </h2>
      <div className="space-y-md">{children}</div>
    </section>
  );
}

interface QuestionItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function QuestionItem({ label, children, className }: QuestionItemProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-lg p-md border border-outline-variant/30 flex flex-col gap-sm",
        className
      )}
    >
      <p className="font-body-md text-body-md text-on-surface">{label}</p>
      {children}
    </div>
  );
}
