export default function Toggle({
  isActive,
  onToggle,
  className = '',
}: {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-24 bg-bgInput flex h-22 w-40 cursor-pointer items-center justify-start p-2 inset-shadow-[0_0_1px_1px_rgba(18,18,18,0.05)] transition-colors duration-300 ${
        isActive ? 'bg-buttonPr' : ''
      } ${className}`}
      onClick={() => {
        onToggle();
      }}
    >
      <div
        className={`relative aspect-square h-full rounded-full bg-[#F8F7F7] shadow-[0_0_2px_rgba(0,0,0,0.25)] transition-transform duration-300 ${
          isActive ? 'translate-x-full' : ''
        }`}
      ></div>
    </div>
  );
}
