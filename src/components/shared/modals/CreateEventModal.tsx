import { createPortal } from 'react-dom';
import ModalWrapper from '../wrappers/ModalWrapper';
import { HugeiconsIcon } from '@hugeicons/react';
import { ClockIcon, Location01Icon } from '@hugeicons/core-free-icons';
import Dropdown from '../Dropdown';
import Input from '../form-elements/Input';
import Button from '../Button';
import { InvitedUserItem } from '../../../pages/Whiteboard';

export default function CreateEventModal({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return createPortal(
    <ModalWrapper>
      <div
        className={
          'rounded-32 bg-bgSec w-433 shadow-[0_0_3rem_rgba(0,0,0,0.3)]'
        }
      >
        <div className={'p-24 pb-10'}>
          <p className={'text-textSecondary text-18 py-16'}>
            Name of the event
          </p>
        </div>

        <div className={'border-linePr border-t px-24 py-10'}>
          <p className={'text-body-s text-textDescription py-8'}>Data</p>

          <div className={'flex items-center gap-12 py-8'}>
            <div
              className={
                'rounded-8 border-linePr bg-bgPr flex size-32 shrink-0 items-center justify-center border'
              }
            >
              <HugeiconsIcon
                icon={ClockIcon}
                className={'text-iconSec size-16'}
              />
            </div>

            <Dropdown
              direction={'down'}
              className={'flex-1'}
              list={['Monday, July 14', 'Monday, July 15', 'Monday, July 16']}
            />

            <div
              className={
                'text-textPr text-body-m rounded-10 flex h-36 items-center justify-center border border-[#ECECEC] bg-[#FCFCFC] px-10 font-medium'
              }
            >
              2:00 PM
            </div>

            <div
              className={
                'text-textPr text-body-m rounded-10 flex h-36 items-center justify-center border border-[#ECECEC] bg-[#FCFCFC] px-10 font-medium'
              }
            >
              3:00 PM
            </div>
          </div>
        </div>

        <div className={'border-linePr border-t px-24 py-10'}>
          <p className={'text-body-s text-textDescription py-8'}>Add guests</p>

          <div className={'flex items-center gap-6 py-16'}>
            <Input placeholder={'Email, name...'} />

            <Button size={'sm'}>Invite</Button>
          </div>

          <div>
            <InvitedUserItem owner />
            <InvitedUserItem />
            <InvitedUserItem />
          </div>
        </div>

        <div className={'border-linePr border-t px-24 py-10'}>
          <p className={'text-body-s text-textDescription py-8'}>Location</p>

          <div className={'flex gap-12 py-8'}>
            <div
              className={
                'rounded-8 bg-bgPr border-linePr text-iconSec flex size-32 items-center justify-center border'
              }
            >
              <HugeiconsIcon className={'size-16'} icon={Location01Icon} />
            </div>

            <Input />
          </div>
        </div>

        <div
          className={
            'border-linePr flex items-stretch gap-24 border-t px-24 py-16'
          }
        >
          <Button
            className={'flex-1'}
            style={'gray'}
            onClick={() => {
              onCancel?.();
            }}
          >
            Close
          </Button>
          <Button
            className={'flex-1'}
            onClick={() => {
              onSave?.();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </ModalWrapper>,
    document.querySelector('#root')!
  );
}
