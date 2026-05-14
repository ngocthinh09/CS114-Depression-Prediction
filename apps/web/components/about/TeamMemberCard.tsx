import { cn } from "@repo/ui/utils";

interface TeamMemberCardProps {
  name: string;
  studentId: string;
  avatarIcon: string;
  avatarBgColor?: "secondary" | "tertiary" | "primary";
}

export const TeamMemberCard = ({
  name,
  studentId,
  avatarIcon,
  avatarBgColor = "secondary",
}: TeamMemberCardProps) => {
  const bgClasses = {
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-container text-on-tertiary-container",
    primary: "bg-primary-container text-on-primary-container",
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-md group p-md">
      <div
        className={cn(
          "w-[100px] h-[100px] shrink-0 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300",
          bgClasses[avatarBgColor]
        )}
      >
        <span className="material-symbols-outlined text-[48px]">
          {avatarIcon}
        </span>
      </div>
      <div className="flex flex-col gap-sm grow justify-center h-full">
        <h3 className="text-headline-md text-on-surface font-semibold whitespace-nowrap">
          {name}
        </h3>
        <span className="inline-flex w-fit mx-auto sm:mx-0 bg-surface-container-highest text-on-surface-variant px-md py-xs rounded-full text-label-md font-medium">
          ID: {studentId}
        </span>
      </div>
    </div>
  );
};
