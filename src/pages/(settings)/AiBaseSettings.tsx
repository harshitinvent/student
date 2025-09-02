import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationCircleIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons';

import SettingsWrapper from '../../components/shared/wrappers/SettingsWrapper';

export default function AiBaseSettings() {
  return (
    <div className={'flex flex-col items-center'}>
      <SettingsWrapper
        title={'AI knowledge base'}
        subtitle={'Manage your account information.'}
      >
        <div
          className={
            'flex items-center justify-between gap-16 px-24 pt-16 pb-10 max-md:px-8 max-md:py-12'
          }
        >
          <p className={'text-14 text-textHeadline font-medium'}>
            Project knowledge
          </p>
          <button
            className={
              'bg-bgNavigate border-linePr rounded-10 text-iconSec hover:shadow-s1 flex size-36 cursor-pointer items-center justify-center border duration-300'
            }
          >
            <HugeiconsIcon className={'size-20'} icon={PlusSignIcon} />
          </button>
        </div>

        <div className={'border-linePr border-t px-24 py-16 max-md:px-8'}>
          <div
            className={
              'border-bgInput bg-bgPr rounded-16 border border-dashed p-16'
            }
          >
            <p
              className={
                'text-textDescription text-body-l align-middle font-medium'
              }
            >
              Set project instructions
              <HugeiconsIcon
                className={'-mt-2 ml-12 inline-block size-20'}
                icon={InformationCircleIcon}
              />
            </p>
          </div>

          <div className={'mt-24'}>
            <div className={'bg-bgIcon2 h-4 w-full rounded'}>
              <hr
                className={
                  'bg-iconGreen block h-full rounded border-none outline-none'
                }
                style={{
                  width: '20%',
                }}
              />
            </div>
            <p className={'text-body-l text-textHeadline mt-6'}>
              20% of project capacity used
            </p>
          </div>

          <div className={'mt-24 grid grid-cols-3 gap-12 max-md:gap-8'}>
            <AiData />
            <AiData />
            <AiData />
            <AiData />
            <AiData />
          </div>
        </div>
      </SettingsWrapper>
    </div>
  );
}

export function AiData({
  title = 'Auron AI Layer',
  fileType = 'DOC',
}: {
  title?: string;
  fileType?: 'DOC';
}) {
  return (
    <div
      className={
        'bg-bgSec rounded-16 border-linePr hover:shadow-s1 flex min-h-104 cursor-pointer flex-col items-start justify-between gap-16 border p-20 transition-shadow duration-300 max-md:p-12'
      }
    >
      <p className={'text-textHeadline text-14 font-medium'}>{title}</p>
      <div className={'flex items-center justify-start gap-4'}>
        <img className={'size-16'} src="/assets/file.svg" alt="file" />
        <p className={'text-textHeadline text-body-l font-medium'}>
          {fileType}
        </p>
      </div>
    </div>
  );
}
