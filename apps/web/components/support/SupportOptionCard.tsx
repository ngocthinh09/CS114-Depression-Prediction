import { cn } from "@repo/ui/utils";

interface SupportOptionCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor?: string;
  iconTextColor?: string;
  className?: string;
}

export const SupportOptionCard = ({
  title,
  description,
  icon,
  iconBgColor = "bg-surface-container-high",
  iconTextColor = "text-on-surface-variant",
  className,
}: SupportOptionCardProps) => {
  return (
    <div
      className={cn(
        "glass-card p-lg rounded-xl soft-shadow flex flex-col items-center text-center gap-sm hover:-translate-y-1 transition-transform duration-300",
        className
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-sm shrink-0",
          iconBgColor,
          iconTextColor
        )}
      >
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-headline-md text-primary font-semibold">{title}</h3>
      <p className="text-body-md text-on-surface-variant">{description}</p>
    </div>
  );
};
