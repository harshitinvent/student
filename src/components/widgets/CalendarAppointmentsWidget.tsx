export default function CalendarAppointmentsWidget({
  size = 'md',
}: {
  size?: 'lg' | 'md';
}) {
  return (
    <div
      className={`rounded-16 bg-bgSec border-linePr border ${
        size === 'md' ? 'p-16 pb-12' : 'p-24 max-md:p-16'
      }`}
    >
      <div>
        <p
          className={`text-textHeadline mb-3 font-medium ${
            size === 'md' ? 'text-body-m' : 'text-h6 text-14'
          }`}
        >
          Thursday
        </p>
        <p
          className={`text-textHeadline ${
            size === 'md' ? 'text-h6 font-medium' : 'text-h3 max-md:text-h5'
          }`}
        >
          27
        </p>
      </div>

      <div
        className={`grid ${size === 'md' ? 'mt-6 gap-6' : 'mt-24 gap-16 max-md:mt-16 max-md:gap-12'}`}
      >
        <AppointmentItem size={size} />
        <AppointmentItem size={size} color={'blue'} />
        <AppointmentItem size={size} color={'blue'} />
      </div>
    </div>
  );
}

export function AppointmentItem({
  size,
  color = 'green',
}: {
  size: 'md' | 'lg';
  color?: 'green' | 'blue';
}) {
  return (
    <div className={`flex items-center ${size === 'md' ? 'gap-5' : 'gap-8'}`}>
      <hr
        className={`shrink-0 border-none outline-none ${
          color === 'green' ? 'bg-iconGreen' : 'bg-iconBlue'
        } ${size === 'md' ? 'h-[calc(100%-0.25rem)] w-2' : 'h-full w-3'}`}
      />
      <div>
        <p
          className={`text-textHeadline ${
            size === 'md' ? 'text-body-m font-medium' : 'text-18 max-md:text-14'
          }`}
        >
          AsanPlan-Daily
        </p>
        <p
          className={`text-textDescription mt-8 max-md:mt-4 ${
            size === 'md'
              ? 'text-body-xs'
              : 'text-body-l max-md:text-body-m font-medium'
          }`}
        >
          09:00 - 09:30 AM
        </p>
      </div>
    </div>
  );
}
