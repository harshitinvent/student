import MemberAvatars from '../../shared/MemberAvatars';

export default function TimelineSection() {
  return (
    <div
      className={'bg-bgSec border-linePr relative h-full border-t md:-mx-24'}
    >
      <div className={'grid grid-cols-4 gap-y-16 max-md:gap-y-8'}>
        <div>
          <div className={'p-24 max-md:p-16'}>
            <p className={'text-textHeadline text-h5 max-md:text-18'}>Q1</p>
            <p
              className={
                'text-16 text-textDescription max-md:text-body-m mt-12 max-md:mt-8'
              }
            >
              Semester 1
            </p>
          </div>
        </div>

        <div>
          <hr className={'bg-linePr absolute top-0 h-full w-1 border-none'} />
          <div className={'p-24 max-md:p-16'}>
            <p className={'text-textHeadline text-h5 max-md:text-18'}>Q2</p>
            <p
              className={
                'text-16 text-textDescription max-md:text-body-m mt-12 max-md:mt-8'
              }
            >
              Semester 2
            </p>
          </div>
        </div>

        <div>
          <hr className={'bg-linePr absolute top-0 h-full w-1 border-none'} />
          <div className={'p-24 max-md:p-16'}>
            <p className={'text-textHeadline text-h5 max-md:text-18'}>Q3</p>
            <p
              className={
                'text-16 text-textDescription max-md:text-body-m mt-12 max-md:mt-8'
              }
            >
              Semester 3
            </p>
          </div>
        </div>

        <div>
          <hr className={'bg-linePr absolute top-0 h-full w-1 border-none'} />
          <div className={'p-24 max-md:p-16'}>
            <p className={'text-textHeadline text-h5 max-md:text-18'}>Q4</p>
            <p
              className={
                'text-16 text-textDescription max-md:text-body-m mt-12 max-md:mt-8'
              }
            >
              Semester 4
            </p>
          </div>
        </div>

        <div
          className={
            'relative z-1 col-span-4 grid grid-cols-subgrid gap-32 divide-x divide-amber-700 px-24 max-md:gap-16 max-md:px-16'
          }
        >
          <TimelineItem color={'blue'} />
        </div>

        <div
          className={
            'relative z-1 col-span-4 grid grid-cols-subgrid gap-32 divide-x divide-amber-700 px-24 max-md:gap-16 max-md:px-16'
          }
        >
          <TimelineItem className={'col-span-3'} color={'red'} />
        </div>

        <div
          className={
            'relative z-1 col-span-4 grid grid-cols-subgrid gap-32 divide-x divide-amber-700 px-24 max-md:gap-16 max-md:px-16'
          }
        >
          <TimelineItem className={'col-start-2 col-end-3'} color={'green'} />
          <TimelineItem className={'col-start-3 col-end-5'} color={'orange'} />
        </div>
      </div>
    </div>
  );
}

export function TimelineItem({
  color = 'green',
  className = '',
}: {
  color: 'green' | 'red' | 'blue' | 'orange';
  className?: string;
}) {
  const colorClass = {
    green: 'bg-bgIcon2 border-iconGreen',
    red: 'bg-bgIcon3 border-iconRed',
    blue: 'bg-bgIcon1 border-iconBlue',
    orange: 'bg-bgIcon4 border-iconOrange',
  }[color];

  return (
    <div
      className={`rounded-8 flex h-48 items-center justify-between gap-6 overflow-hidden border pr-16 pl-12 ${colorClass} ${className}`}
    >
      <p
        className={
          'text-textHeadline text-16 overflow-hidden text-ellipsis whitespace-nowrap'
        }
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, quam!
      </p>
      <MemberAvatars size={'sm'} />
    </div>
  );
}
