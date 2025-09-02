import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

export default function IconCard({
  size = 'md',
  color = 'green',
  icon: Icon,
  className = '',
}: {
  size?: 'md' | 'sm';
  color?: 'green' | 'blue' | 'orange' | 'red';
  icon: IconSvgElement;
  className?: string;
}) {
  return (
    <div
      className={`shadow-s1 rounded-8 flex shrink-0 items-center justify-center ${
        size === 'md' ? 'size-64' : 'size-48'
      } ${
        color === 'green'
          ? 'bg-bgIcon2 text-iconGreen'
          : color === 'blue'
            ? 'bg-bgIcon1 text-iconBlue'
            : color === 'orange'
              ? 'bg-bgIcon4 text-iconOrange'
              : 'bg-bgIcon3/70 text-iconRed'
      } ${className}`}
    >
      <HugeiconsIcon
        className={` ${size === 'md' ? 'size-32' : 'size-24'}`}
        icon={Icon}
      />
    </div>
  );
}
