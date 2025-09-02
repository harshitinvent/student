export default function Avatar({
  src,
  className = '',
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      {src ? (
        <img
          className={'size-full rounded-full'}
          src={src}
          alt="Profile Avatar"
        />
      ) : (
        <div
          className={
            'bg-bgNavigate text-iconBlue flex size-full items-center justify-center rounded-full text-[75%] font-semibold'
          }
        >
          S
        </div>
      )}
    </div>
  );
}
