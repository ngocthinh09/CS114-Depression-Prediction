import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "body-lg",
            "body-md",
            "label-md",
            "label-sm",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "primary",
            "on-primary",
            "secondary",
            "on-secondary",
            "tertiary",
            "on-tertiary",
            "error",
            "on-error",
            "surface",
            "on-surface",
            "on-surface-variant",
            "outline",
            "outline-variant",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
