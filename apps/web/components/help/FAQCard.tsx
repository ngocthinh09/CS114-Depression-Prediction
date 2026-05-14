import { cn } from "@repo/ui/utils";

interface FAQCardProps {
  question: string;
  answer: string;
  icon: string;
  iconColor?: "primary" | "secondary" | "tertiary" | "error";
}

export const FAQCard = ({
  question,
  answer,
  icon,
  iconColor = "primary",
}: FAQCardProps) => {
  const iconColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    error: "text-error",
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-sm mb-sm">
        <span
          className={cn(
            "material-symbols-outlined mt-1 shrink-0",
            iconColors[iconColor]
          )}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h4 className="text-headline-md text-on-surface leading-tight" style={{ fontSize: "20px" }}>
          {question}
        </h4>
      </div>
      <p className="text-body-md text-on-surface-variant pl-10">{answer}</p>
    </div>
  );
};
