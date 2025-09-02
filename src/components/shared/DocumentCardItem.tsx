import IconCard from "./icons/IconCard";
import { FileAttachmentIcon } from "@hugeicons/core-free-icons";

export default function DocumentCardItem({
  title,
  subtitle,
  iconColor = "green",

  className = "",
}: {
  title: string;
  subtitle?: string;
  iconColor?: "green" | "blue" | "orange" | "red";

  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-start w-full overflow-hidden gap-12 ${className}`}
    >
      <div className={"shrink-0"}>
        <IconCard
          color={iconColor}
          className={"!size-40 [&>svg]:size-20"}
          icon={FileAttachmentIcon}
        />
      </div>
      <div className={"flex-1 overflow-hidden grid gap-6"}>
        <p
          className={
            "overflow-hidden text-body-l font-medium text-textPr text-ellipsis whitespace-nowrap"
          }
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={
              "overflow-hidden text-body-s font-medium text-textSecondary text-ellipsis whitespace-nowrap"
            }
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
