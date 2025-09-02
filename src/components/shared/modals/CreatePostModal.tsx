import { createPortal } from 'react-dom';
import ModalWrapper from '../wrappers/ModalWrapper';
import Input from '../form-elements/Input';
import Button from '../Button';
import { InvitedUserItem } from '../../../pages/Whiteboard';
import MessageTextarea from '../../features/MessageTextarea';

export default function CreatePostModal({
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
          <p className={'text-textSecondary text-18 py-16'}>Create</p>
        </div>

        <div className={'border-linePr border-t px-24 pt-10 pb-20'}>
          <p className={'text-body-s text-textDescription mb-8 py-12'}>
            Description
          </p>

          <MessageTextarea
            hideSubmitButton
            placeholder={'Please, write description...'}
          />
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
