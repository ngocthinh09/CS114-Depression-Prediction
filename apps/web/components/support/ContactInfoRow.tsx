import { cn } from "@repo/ui/utils";

interface ContactInfoRowProps {
  label: string;
  value: string;
  icon: string;
  className?: string;
}

export const ContactInfoRow = ({
  label,
  value,
  icon,
  className,
}: ContactInfoRowProps) => {
  return (
    <div className={cn("flex items-center gap-md bg-surface p-md rounded-lg", className)}>
      <span
        className="material-symbols-outlined text-primary shrink-0"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <p className="text-label-sm text-outline uppercase tracking-wider">{label}</p>
        <p className="text-body-md text-on-surface font-medium leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
};
