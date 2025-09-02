import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export default function CheckmarkIcon({
  active,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        "text-textSecondary size-24 rounded-6 border border-linePr bg-bgNavigate flex items-center justify-center duration-300 group-hover/checkmark:bg-bgSec group-hover/checkmark:shadow-s1"
      }
      onClick={() => {
        onClick?.();
      }}
    >
      {active && <HugeiconsIcon className={"size-16"} icon={Tick02Icon} />}
    </div>
  );
}
