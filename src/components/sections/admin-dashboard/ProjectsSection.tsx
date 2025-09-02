import { useState } from 'react';

import { PlusSignIcon } from '@hugeicons/core-free-icons';
import CatalogCard from '../../shared/CatalogCard';
import MemberAvatars from '../../shared/MemberAvatars';
import CalendarAppointmentsWidget from '../../widgets/CalendarAppointmentsWidget';
import Upload from '../../shared/form-elements/Upload';
import { HugeiconsIcon } from '@hugeicons/react';
import CreateAssignmentModal from '../../shared/modals/CreateAssignmentModal';

export default function ProjectsSection() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={'max-md:px-16'}>
      <div
        className={'flex items-center justify-start px-38 py-16 max-md:px-0'}
      >
        <p className={'text-textHeadline text-h6 font-medium'}>
          Active workflows
        </p>
      </div>

      <div className={'rounded-32 bg-bgSec shadow-s1 overflow-hidden'}>
        <div className={'border-linePr border-b p-24 pb-10 max-md:p-16'}>
          <div className={'flex items-center justify-between gap-12 py-8'}>
            <p
              className={'text-h5 text-textHeadline max-md:text-18 font-medium'}
            >
              CS401 New Course Proposal
            </p>
            <MemberAvatars />
          </div>
        </div>

        <div
          className={
            'grid gap-20 px-24 py-16 max-md:px-16 md:grid-cols-[1fr_9.6875rem]'
          }
        >
          <div>
            <p className={'text-textDescription text-body-s py-8 font-medium'}>
              Steps
            </p>
            <div className={'grid grid-cols-4 gap-8'}>
              <div>
                <hr className={'bg-iconGreen h-2 w-full border-none'} />
                <p
                  className={
                    'text-body-l text-textHeadline mt-10 font-semibold'
                  }
                >
                  Step 1
                </p>
              </div>
              <div>
                <hr className={'bg-bgIcon2 h-2 w-full border-none'} />
                <p
                  className={
                    'text-body-l text-textHeadline mt-10 font-semibold'
                  }
                >
                  Step 2
                </p>
              </div>
              <div>
                <hr className={'bg-bgIcon2 h-2 w-full border-none'} />
                <p
                  className={
                    'text-body-l text-textHeadline mt-10 font-semibold'
                  }
                >
                  Step 3
                </p>
              </div>
              <div>
                <hr className={'bg-bgIcon2 h-2 w-full border-none'} />
                <p
                  className={
                    'text-body-l text-textHeadline mt-10 font-semibold'
                  }
                >
                  Step 4
                </p>
              </div>
            </div>

            <Upload className={'mt-20'} />
          </div>

          <CalendarAppointmentsWidget />
        </div>
      </div>

      <div
        className={
          'mt-24 flex items-center justify-start px-38 py-16 max-md:mt-16 max-md:px-0'
        }
      >
        <p className={'text-textHeadline text-h6 font-medium'}>
          Active documents
        </p>
      </div>

      <div
        className={
          'mt-12 grid grid-cols-4 gap-16 max-md:-mx-16 max-md:mt-0 max-md:flex max-md:gap-12 max-md:overflow-x-auto max-md:px-16 max-md:[&>*]:shrink-0'
        }
      >
        {Array(5)
          .fill('')
          .map((_, i) => (
            <CatalogCard
              key={'item-' + i}
              forSaving={false}
              previewColor={'gray'}
              to={'/'}
              title={'Q1 report'}
              subtitle={'Short description'}
              className={'max-md:w-220'}
            >
              <div className={'mt-12 flex items-center justify-between gap-12'}>
                <MemberAvatars size={'sm'} />
                <p className={'text-textHeadline text-body-l font-medium'}>
                  05/07/25
                </p>
              </div>
            </CatalogCard>
          ))}

        <div
          className={
            'bg-bgSec rounded-24 border-linePr grid cursor-pointer gap-8 border p-8 transition-shadow duration-300 hover:shadow-[0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_9.5625rem_3.8125rem_rgba(0,0,0,0.01)]'
          }
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <div
            className={
              'rounded-16 bg-bgNavigate flex size-full items-center justify-center gap-16 max-md:px-16'
            }
          >
            <div
              className={
                'bg-bgInput rounded-10 text-iconSec flex size-36 items-center justify-center'
              }
            >
              <HugeiconsIcon className={'size-20'} icon={PlusSignIcon} />
            </div>
            <p className={'text-14 text-textHeadline font-medium'}>
              Upload document
            </p>
          </div>
        </div>

        {openModal && (
          <CreateAssignmentModal onClose={() => setOpenModal(false)} />
        )}
      </div>
    </div>
  );
}
