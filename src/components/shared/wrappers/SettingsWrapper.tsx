export default function SettingsWrapper({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-564 ${className}`}>
      {(title || subtitle) && (
        <div className={'py-16'}>
          {title && (
            <h2
              className={
                'text-h6 text-textHeadline max-md:text-18 max-md:font-semibold'
              }
            >
              {title}{' '}
            </h2>
          )}
          {subtitle && (
            <p className={'text-16 text-textDescription max-md:text-14 mt-5'}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        className={
          'rounded-16 border-linePr bg-bgSec mt-16 w-full border max-md:mt-8'
        }
      >
        {children}
      </div>
    </div>
  );
}
