import Avatar from './Avatar';
import { Link } from 'react-router';
import CustomIcon from './icons/CustomIcon';
import Button from './Button';

export default function NotificationItem() {
  return (
    <div
      className={
        'border-linePr flex items-start gap-16 p-20 pr-16 not-first:border-t'
      }
    >
      <div className={'relative size-48 shrink-0'}>
        <Avatar className={'size-full'} />
        <div
          className={
            'border-bgPr absolute -right-4 -bottom-4 flex size-22 items-center justify-center overflow-hidden rounded-full border-2 bg-[#8651F8] text-[#FCFCFC]'
          }
        >
          <CustomIcon className={'size-12'} icon={'comment'} />
        </div>
      </div>

      <div>
        <div className={'grid w-full gap-8'}>
          <div
            className={'flex w-full items-start justify-between gap-8 pr-16'}
          >
            <div className={'flex items-start gap-4'}>
              <p className={'text-body-l text-textPr font-semibold'}>
                3D object is generated
              </p>
              <time
                className={
                  'text-body-m text-textSecondary mt-1 font-medium whitespace-nowrap'
                }
              >
                1h ago
              </time>
            </div>

            <span
              className={
                'bg-iconGreen mt-5 ml-4 block size-8 shrink-0 rounded-full'
              }
            ></span>
          </div>

          <p
            className={
              'text-body-l text-textSecondary [&_strong]:text-textPr [&_a]:text-textPr [&_a:hover]:text-textDescription [&_a]:font-semibold [&_a]:duration-300 [&_strong]:font-normal'
            }
          >
            <strong>Commented</strong> on{' '}
            <Link to={'/'}>Classic Car in Studio</Link>
          </p>

          <p className={'text-textSecondary text-paragraph-s line-clamp-2'}>
            These draggabale sliders look really cool. Maybe these could be
            displayed when you hold shift, to rotate exactly on the X or Y. But
            by default I don't think we need these controllers, you could just
            rotate the object by clicking and dragging anywhere as expected on
            any 3D tool (theoretically).
          </p>
        </div>

        <div className={'mt-16 flex items-center gap-8'}>
          <Button size={'sm'} style={'gray'}>
            Decline
          </Button>

          <Button size={'sm'}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
