import { type ReactNode, type RefObject } from 'react';

export default function PopUpWrapper({
  className = '',
  children,
  ref,
}: {
  className?: string;
  children: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={ref}
      className={`rounded-24 bg-bgPr border-linePr shadow-s1 overflow-hidden border ${className}`}
    >
      {children}
    </div>
  );
}
