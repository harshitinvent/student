import { createPortal } from 'react-dom';
import SearchInput from '../form-elements/SearchInput';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon } from '@hugeicons/core-free-icons';
import CatalogCard from '../CatalogCard';
import ModalWrapper from '../wrappers/ModalWrapper';

export default function CreateAssignmentModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return createPortal(
    <ModalWrapper>
      <div
        className={
          'bg-bgSec rounded-32 max-md:rounded-24 shadow-s1 w-800 p-24 max-md:p-16'
        }
      >
        <div className={'flex items-center justify-between gap-12'}>
          <SearchInput
            value={''}
            onChange={() => {}}
            onSubmit={() => {}}
            className={'max-w-260'}
          />

          <button
            className={
              'bg-bgPr hover:shadow-s1 border-linePr rounded-12 text-textHeadline flex size-40 cursor-pointer items-center justify-center border duration-300'
            }
            onClick={() => {
              onClose?.();
            }}
          >
            <HugeiconsIcon className={'size-16'} icon={CancelIcon} />
          </button>
        </div>

        <div
          className={
            'mt-32 gap-12 max-md:-mx-16 max-md:flex max-md:overflow-y-auto max-md:px-16 md:grid md:grid-cols-3'
          }
        >
          <CatalogCard
            to={'/assignment/edit/12'}
            previewColor={'green'}
            title={'Canvas builder'}
            subtitle={'Create or edit your study notes'}
            forSaving={false}
            className={'shrink-0'}
          >
            <p className={'text-body-l text-textDescription mt-8 font-medium'}>
              05/07/25
            </p>
          </CatalogCard>

          <CatalogCard
            to={'/assignment/edit/12'}
            previewColor={'green'}
            title={'Build from scratch'}
            subtitle={'Create or edit your study notes'}
            forSaving={false}
            className={'shrink-0'}
          >
            <p className={'text-body-l text-textDescription mt-8 font-medium'}>
              05/07/25
            </p>
          </CatalogCard>

          <CatalogCard
            to={'/assignment/edit/12'}
            previewColor={'green'}
            title={'AI generated'}
            subtitle={'Create or edit your study notes'}
            forSaving={false}
            className={'shrink-0'}
          >
            <p className={'text-body-l text-textDescription mt-8 font-medium'}>
              05/07/25
            </p>
          </CatalogCard>
        </div>

        <div className={'mt-32'}>
          <p className={'text-h6 text-textHeadline font-medium'}>Templates</p>
          <div
            className={
              'mt-16 gap-12 max-md:-mx-16 max-md:flex max-md:overflow-y-auto max-md:px-16 md:grid md:grid-cols-3'
            }
          >
            <CatalogCard
              to={'/assignment/edit/12'}
              previewColor={'gray'}
              title={'Canvas builder'}
              subtitle={'Create or edit your study notes'}
              forSaving={false}
              className={'shrink-0'}
            />

            <CatalogCard
              to={'/assignment/edit/12'}
              previewColor={'gray'}
              title={'Build from scratch'}
              subtitle={'Create or edit your study notes'}
              forSaving={false}
              className={'shrink-0'}
            />

            <CatalogCard
              to={'/assignment/edit/12'}
              previewColor={'gray'}
              title={'AI generated'}
              subtitle={'Create or edit your study notes'}
              forSaving={false}
              className={'shrink-0'}
            />
          </div>
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById('root')!
  );
}
