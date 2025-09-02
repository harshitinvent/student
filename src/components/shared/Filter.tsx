import { useState, useRef } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import CustomIcon from "./icons/CustomIcon";

import { useClickOutside } from "../../utils/hooks/useClickOutside";

const filterList = [
  ["All scenes", "Designs", "Animation"],
  ["Newest first", "Oldest first"],
];

export default function Filter() {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<string[]>([
    filterList[0][0],
    filterList[1][0],
  ]);

  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
    },
    isOpen,
    buttonRef,
  );

  return (
    <div className={" relative z-1    "}>
      <div
        ref={buttonRef}
        className={
          "flex w-136 items-center gap-4 rounded-10 cursor-pointer border border-transparent duration-300 transition-colors bg-transparent p-8 select-none hover:border-[#E2E2E2] hover:bg-[#F8F7F7]"
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={
            "text-iconSec flex size-24 shrink-0 items-center justify-center"
          }
        >
          <HugeiconsIcon icon={FilterIcon} className={"size-16"} />
        </div>
        <p
          className={
            "text-textHeadline text-body-m flex-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap"
          }
        >
          {activeFilters[0]}
        </p>
        <div
          className={
            "text-textPr flex size-24 shrink-0 items-center justify-center"
          }
        >
          <CustomIcon className={"[&_*]:stroke-1.5 size-20"} icon={"chevron"} />
        </div>
      </div>

      <div
        ref={dropdownRef}
        className={`rounded-16 absolute top-[calc(100%+0.5rem)] -left-6 min-w-171 origin-top-left border border-[#ECECEC] bg-[#FCFCFC] shadow-[0_9.5625rem_3.8125rem_rgba(0,0,0,0.01),0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_2.375rem_2.375rem_rgba(0,0,0,0.06),0_0.625rem_1.6875rem_rgba(0,0,0,0.07)] duration-300 select-none ${
          isOpen ? "" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {filterList.map((list, listIndex) => (
          <ul
            key={"filter-list-section-" + listIndex}
            className={"border-[#ECECEC] p-8 not-first:border-t"}
          >
            {list.map((item) => (
              <li
                key={"filter-item-" + item}
                className={
                  "text-body-m rounded-10 flex cursor-pointer items-center gap-4 p-6 transition-colors duration-300 hover:bg-[#F1F1F1]"
                }
                onClick={() =>
                  setActiveFilters((prevState) => {
                    const updated = [...prevState];
                    updated[listIndex] = item;
                    return updated;
                  })
                }
              >
                <div
                  className={
                    "text-textSecondary flex size-24 items-center justify-center"
                  }
                >
                  {activeFilters[listIndex] === item && (
                    <HugeiconsIcon icon={Tick02Icon} className={"size-16"} />
                  )}
                </div>

                <span>{item}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
