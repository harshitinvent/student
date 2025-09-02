export default function CardWrapper({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-bgSec border-linePr rounded-24 border ${className}`}>
      {children}
    </div>
  );
}

CardWrapper.TitleArea = function TitleArea({
  title,

  className = '',
  children,
}: {
  title: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-12 max-md:block max-md:gap-4 ${className}`}
    >
      {typeof title === 'string' ? (
        <h2
          className={
            'text-textHeadline text-h6 flex min-h-48 items-center px-20 font-medium max-md:px-8'
          }
        >
          {title}
        </h2>
      ) : (
        title
      )}
      <div>{children}</div>
    </div>
  );
};
