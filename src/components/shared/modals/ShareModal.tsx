import { createPortal } from 'react-dom';

import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon } from '@hugeicons/core-free-icons';

import ModalWrapper from '../wrappers/ModalWrapper';
import Input from '../form-elements/Input';
import Button from '../Button';
import { InvitedUserItem } from '../../../pages/Whiteboard';

export default function ShareModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <ModalWrapper>
      <div
        className={
          'rounded-32 bg-bgSec w-433 shadow-[0_0_3rem_rgba(0,0,0,0.3)]'
        }
      >
        <div className={'flex items-center justify-between gap-12 px-24 py-16'}>
          <p className={'text-textHeadline text-18 py-16 font-medium'}>Share</p>
          <button
            className={
              'border-linePr rounded-8 bg-bgNavigate hover:shadow-s1 flex size-40 cursor-pointer items-center justify-center border duration-300'
            }
            onClick={() => onClose?.()}
          >
            <HugeiconsIcon icon={CancelIcon} className={'size-20'} />
          </button>
        </div>

        <div className={'border-linePr border-t px-24 py-10'}>
          <p className={'text-body-s text-textDescription py-8'}>Share for:</p>

          <div className={'flex items-center gap-6 py-16'}>
            <Input placeholder={'Email, name...'} />

            <Button size={'sm'}>Share</Button>
          </div>

          <div>
            <InvitedUserItem owner />
            <InvitedUserItem />
            <InvitedUserItem />
          </div>
        </div>
      </div>
    </ModalWrapper>,
    document.querySelector('#root')!
  );
}
