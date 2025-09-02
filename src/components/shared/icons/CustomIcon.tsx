type IconsList =
  | 'arrow'
  | 'chevron'
  | 'navigation-line'
  | 'navigation-line-s'
  | 'comment'
  | 'tooltip-arrow';

export default function CustomIcon({
  icon,
  color,
  className = '',
}: {
  icon: IconsList;
  color?: string;
  className?: string;
}) {
  const iconColor = color ?? 'currentColor';

  return (
    <>
      {icon === 'arrow' && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={iconColor}
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M6.47027 6.00025L4.4834 4.01337L5.05096 3.44581L7.6054 6.00025L5.05096 8.55469L4.4834 7.98712L6.47027 6.00025Z" />
        </svg>
      )}

      {icon === 'chevron' && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10.667 6.66709L8.47173 8.86236C8.21138 9.1227 7.78927 9.1227 7.52892 8.86235L5.33366 6.66709"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {icon === 'navigation-line' && (
        <svg
          width="18"
          height="53"
          viewBox="0 0 18 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M1 1L1 44C1 48.4183 4.58172 52 9 52L17 52"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {icon === 'navigation-line-s' && (
        <svg
          width="18"
          height="24"
          viewBox="0 0 18 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M1 1L1 15C1 19.4183 4.58172 23 9 23L17 23"
            stroke={iconColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {icon === 'comment' && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={iconColor}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.00097 1.50001L9.00097 1.5C9.8294 1.5 10.501 2.17157 10.501 3V8.01788C10.501 8.8463 9.82941 9.51787 9.00098 9.51788L7.68784 9.51788L6.31783 10.6529C6.13196 10.8069 5.86262 10.8061 5.67764 10.6511L4.32579 9.51789H3.00098C2.17255 9.51789 1.50098 8.84631 1.50098 8.01789V3.00001C1.50098 2.17159 2.17255 1.50001 3.00097 1.50001ZM5.99988 3.5C6.15767 3.5 6.28559 3.62792 6.28559 3.78571C6.28559 4.34608 6.40971 4.68435 6.61262 4.88726C6.81553 5.09017 7.1538 5.21429 7.71416 5.21429C7.87196 5.21429 7.99988 5.3422 7.99988 5.5C7.99988 5.6578 7.87196 5.78571 7.71416 5.78571C7.1538 5.78571 6.81553 5.90984 6.61262 6.11275C6.40971 6.31566 6.28559 6.65392 6.28559 7.21429C6.28559 7.37208 6.15767 7.5 5.99988 7.5C5.84208 7.5 5.71416 7.37208 5.71416 7.21429C5.71416 6.65392 5.59004 6.31566 5.38713 6.11275C5.18422 5.90984 4.84595 5.78571 4.28559 5.78571C4.1278 5.78571 3.99988 5.6578 3.99988 5.5C3.99988 5.3422 4.1278 5.21429 4.28559 5.21429C4.84595 5.21429 5.18422 5.09017 5.38713 4.88726C5.59004 4.68435 5.71416 4.34608 5.71416 3.78571C5.71416 3.62792 5.84208 3.5 5.99988 3.5Z"
          />
        </svg>
      )}

      {icon === 'tooltip-arrow' && (
        <svg
          width="11"
          height="6"
          viewBox="0 0 11 6"
          fill={iconColor}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.73178 5.07814L0.5 0H10.5L6.26822 5.07813C5.86843 5.55789 5.13157 5.55789 4.73178 5.07814Z" />
        </svg>
      )}
    </>
  );
}
