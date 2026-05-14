import { cn } from "@repo/ui/utils";

interface UrgentNoticeProps {
  message: string;
  className?: string;
}

export const UrgentNotice = ({ message, className }: UrgentNoticeProps) => {
  return (
    <div
      className={cn(
        "bg-error-container text-on-error-container p-md rounded-xl flex items-start gap-md soft-shadow",
        className
      )}
    >
      <span
        className="material-symbols-outlined text-error shrink-0"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        warning
      </span>
      <div>
        <p className="text-body-md font-semibold leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};
