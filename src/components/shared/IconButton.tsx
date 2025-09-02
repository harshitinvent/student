import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

export default function IconButton({
  active,
  icon,
  onClick,
  children,
  className = '',
  disabled = false,
}: {
  disabled?: boolean;
  icon?: IconSvgElement;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      disabled={disabled}
      className={`rounded-12 disabled:text-textSecondary flex size-40 cursor-pointer items-center justify-center border border-transparent duration-300 select-none hover:bg-[#F1F1F1] disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? 'pointer-events-none bg-[#F1F1F1] inset-shadow-[0_-1px_3px_rgba(18,18,18,0.15),0_1.25px_1px_#ffffff]'
          : ''
      } ${className}`}
      onClick={() => {
        onClick?.();
      }}
    >
      {icon && <HugeiconsIcon icon={icon} className={'size-20'} />}
      {children}
    </button>
  );
}
