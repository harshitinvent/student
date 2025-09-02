import { type ReactNode, type MouseEvent } from 'react';

export default function Button({
  icon,
  style = 'dark',
  size = 'md',
  onClick,
  children,
  className = '',
  disabled = false,
  htmlType = 'button',
}: {
  style?: 'dark' | 'gray' | 'transparent' | 'gray-border';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
}) {
  const sizeClasses = {
    sm: 'h-36 px-20 rounded-10',
    md: 'h-40 px-24 rounded-12',
  }[size];

  const styleClasses = {
    dark: 'bg-buttonPr text-neutral-5 font-semibold hover:bg-buttonPrHover disabled:bg-buttonPrDisabled active:shadow-[inset_0_0_0_0.0625rem_#FCFCFC] active:bg-[#222222]',
    gray: 'bg-buttonSec text-neutral-90 font-semibold hover:bg-buttonSecHover disabled:bg-buttonSecDisabled active:bg-buttonSecPressed active:inset-shadow-[0_0.0625rem_0_rgba(255,255,255,0.7)]',
    transparent:
      'bg-transparent text-iconBlue font-semibold hover:bg-buttonSecHover disabled:bg-buttonSecDisabled',
    'gray-border':
      'bg-transparent text-textHeadline font-medium border border-linePr hover:bg-bgSec hover:shadow-s1 disabled:opacity-60',
  }[style];

  return (
    <button
      // type={`button`}
      type={htmlType}
      disabled={disabled}
      className={`button text-heading flex cursor-pointer items-center justify-center gap-8 text-center duration-300 outline-none select-none ${sizeClasses} ${styleClasses} ${className}`}
      onClick={(e) => !disabled && onClick?.(e)}
    >
      {icon && <div className={'size-20 [&>*]:size-full'}>{icon}</div>}
      {children}
    </button>
  );
}
