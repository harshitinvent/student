import { type MouseEvent, useEffect, useRef, useState } from 'react';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  CalendarIcon,
  Clock01Icon,
  CancelIcon,
} from '@hugeicons/core-free-icons';

import StatusTag from '../shared/StatusTag';
import MemberAvatars from '../shared/MemberAvatars';
import Textarea from '../shared/form-elements/Textarea';
import CustomIcon from '../shared/icons/CustomIcon';
import Button from '../shared/Button';
import Avatar from '../shared/Avatar';
import { useComputeElementHeight } from '../../utils/hooks/useComputeElementHeight';

export default function ActionRequestCard() {
  const accordionWrapperRef = useRef<HTMLDivElement>(null);
  const accordionContentRef = useRef<HTMLDivElement>(null);

  const [accordionOpened, setAccordionOpened] = useState<boolean>(false);

  useComputeElementHeight(
    accordionWrapperRef,
    accordionContentRef,
    () => {
      if (accordionWrapperRef.current) {
        accordionWrapperRef.current.removeAttribute('style');
      }
    },
    accordionOpened
  );

  return (
    <div
      className={
        'rounded-32 border-linePr shadow-s1 max-md:rounded-16 overflow-hidden border'
      }
    >
      <div
        className={'border-linePr border-b p-24 max-md:p-16'}
        onClick={() => {
          setAccordionOpened(!accordionOpened);
        }}
      >
        <div
          className={
            'flex min-h-48 items-center justify-between gap-24 max-md:min-h-36 max-md:gap-16'
          }
        >
          <div className={'flex items-center gap-18 max-md:gap-16'}>
            <p
              className={'text-h5 text-textHeadline max-md:text-18 font-medium'}
            >
              Finance request
            </p>
            <StatusTag status={'error'} icon={Clock01Icon}>
              Urgent
            </StatusTag>
          </div>

          <div className={'flex items-center gap-18 max-md:gap-16'}>
            <MemberAvatars />
            <CustomIcon
              className={`size-24 shrink-0 duration-300 ${accordionOpened ? 'rotate-180' : ''}`}
              icon={'chevron'}
            />
          </div>
        </div>
      </div>

      <div
        ref={accordionWrapperRef}
        className={'h-0 overflow-hidden duration-300'}
      >
        <div ref={accordionContentRef}>
          <div className={'border-linePr border-b px-24 py-10 max-md:px-16'}>
            <p className={'text-body-s text-textDescription py-8 font-medium'}>
              Description:
            </p>

            <p className={'text-16 text-textHeadline'}>
              Need Finance approval for new lab equipment purchase by Friday.
              The Chemistry department requires new spectrometers for the
              upcoming semester. @JohnFinance @BudgetTeam
            </p>

            <div className={'mt-20'}>
              <Textarea withAttachment className={'!h-64'} />
            </div>
          </div>

          <div className={'border-linePr border-b px-24 py-10 max-md:px-16'}>
            <p className={'text-textDescription text-body-s py-8 font-medium'}>
              Data
            </p>
            <div className={'flex items-center justify-between gap-12'}>
              <p
                className={
                  'text-body-m text-textPr flex items-center justify-start gap-8 font-medium'
                }
              >
                Monday, July 14{' '}
                <HugeiconsIcon
                  className={'text-iconSec size-14'}
                  icon={CalendarIcon}
                />
              </p>

              <StatusTag status={'draft'} icon>
                Draft
              </StatusTag>
            </div>
          </div>

          <div className={'border-linePr border-b'}>
            <div
              className={
                'flex h-68 cursor-pointer items-center justify-between gap-12 px-24 max-md:px-16'
              }
            >
              <p
                className={'text-textDescription text-body-s py-8 font-medium'}
              >
                Team
              </p>
              <CustomIcon className={'text-iconSec'} icon={'chevron'} />
            </div>

            <div>
              <ul className={'px-24 pb-10 max-md:px-16'}>
                <li
                  className={'flex items-center justify-between gap-12 py-10'}
                >
                  <div className={'flex items-center justify-start gap-12'}>
                    <Avatar className={'size-32'} />

                    <div>
                      <p className={'text-textPr text-body-m font-medium'}>
                        Sam Dy
                      </p>
                      <p
                        className={
                          'text-textDescription text-body-m font-medium'
                        }
                      >
                        Owner
                      </p>
                    </div>
                  </div>

                  <div className={'text-body-s text-textHeadline'}>Owner</div>
                </li>
                <li
                  className={'flex items-center justify-between gap-12 py-10'}
                >
                  <div className={'flex items-center justify-start gap-12'}>
                    <Avatar className={'size-32'} />

                    <div>
                      <p className={'text-textPr text-body-m font-medium'}>
                        Sam Dy
                      </p>
                      <div
                        className={
                          'text-body-s text-textHeadline flex items-center justify-start gap-12'
                        }
                      >
                        <p>Owner</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      'text-body-s text-textHeadline flex items-center justify-start gap-12'
                    }
                  >
                    <p>Performer</p>
                    <button
                      className={
                        'text-iconSec hover:text-iconRed size-20 cursor-pointer transition-colors duration-300 outline-none select-none'
                      }
                    >
                      <HugeiconsIcon
                        className={'size-full'}
                        icon={CancelIcon}
                      />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={'px-24 py-10 max-md:px-16'}>
            <div
              className={
                'justify-between gap-24 py-8 max-md:gap-16 md:flex md:items-center'
              }
            >
              <Button style={'gray'} size={'sm'}>
                Reports
              </Button>

              <div
                className={
                  'flex items-center gap-4 max-md:mt-16 md:justify-end'
                }
              >
                <Button style={'transparent'} size={'sm'}>
                  Projects
                </Button>
                <Button style={'transparent'} size={'sm'}>
                  Issues / Conflics
                </Button>
                <Button style={'transparent'} size={'sm'}>
                  Directory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
