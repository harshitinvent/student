export default function ModalWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-textHeadline/40 fixed inset-0 z-51 flex items-center justify-center overflow-hidden p-50 max-md:px-16 max-md:py-24 ${className}`}
    >
      {children}
    </div>
  );
}
