import { useState } from 'react';
import { Link, type To } from 'react-router';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { BookOpenIcon } from '@hugeicons/core-free-icons';
import { StarIcon } from '@hugeicons/core-free-icons';

import StatusTag, { type StatusType } from './StatusTag';

export default function CatalogCard({
  to,
  imgUrl,
  previewColor = 'green',
  previewIcon,
  title,
  subtitle,
  info,
  status,
  forSaving = true,
  isListType = false,
  children,
  className = '',
}: {
  to: To;
  imgUrl?: string;
  previewColor?: 'green' | 'blue' | 'orange' | 'red' | 'gray';
  previewIcon?: IconSvgElement;
  title: string;
  subtitle: string;
  info?: string;
  status?: StatusType;
  forSaving?: boolean;
  isListType?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isFav, setIsFav] = useState<boolean>(false);

  const previewColorClasses = {
    green: 'bg-bgIcon2 text-iconGreen',
    blue: 'bg-bgIcon1 text-iconBlue',
    orange: 'bg-bgIcon4 text-iconOrange',
    red: 'bg-bgIcon3 text-iconRed',
    gray: 'bg-bgNavigate text-iconSec',
  }[previewColor];

  return (
    <Link
      to={to}
      className={`bg-bgSec rounded-24 border-linePr relative cursor-pointer border p-8 transition-shadow duration-300 hover:shadow-[0_5.375rem_3.25rem_rgba(0,0,0,0.04),0_9.5625rem_3.8125rem_rgba(0,0,0,0.01)] ${
        isListType
          ? 'flex h-fit min-h-120 items-center justify-between pr-24 max-md:pr-16'
          : 'grid'
      } ${className}`}
    >
      <div
        className={`rounded-16 bg-bgInput relative shrink-0 overflow-hidden ${
          isListType ? 'h-102 max-h-full w-135' : 'h-120'
        }`}
      >
        {imgUrl ? (
          <img
            className={'rounded-16 block size-full object-cover'}
            src={imgUrl}
            alt="COURSE"
          />
        ) : (
          <div
            className={`rounded-16 flex size-full items-center justify-center ${previewColorClasses}`}
          >
            <HugeiconsIcon
              className={'size-48'}
              icon={previewIcon || BookOpenIcon}
            />
          </div>
        )}
      </div>

      <div
        className={`min-h-60 ${
          isListType ? 'flex flex-1 items-center justify-between pl-16' : 'p-12'
        }`}
      >
        <div className={'grid gap-4'}>
          <h3
            className={
              'text-14 text-textHeadline overflow-hidden font-medium text-ellipsis whitespace-nowrap'
            }
          >
            {title}
          </h3>

          <div
            className={`text-textDescription text-body-l flex font-medium ${
              isListType
                ? 'flex-col gap-4'
                : 'items-start justify-between gap-8'
            }`}
          >
            <p>{subtitle}</p>
            {info && <p className={'shrink-0'}>{info}</p>}
          </div>
        </div>

        <div
          className={
            isListType ? 'flex items-center justify-center gap-16' : ''
          }
        >
          <div className={isListType ? 'flex flex-col items-end' : ''}>
            {status && (
              <StatusTag
                className={isListType ? '' : 'mt-12'}
                icon={true}
                status={status}
              >
                {status === 'success' && 'Success'}
                {status === 'pending' && 'Pending'}
                {status === 'error' && 'Failed'}
              </StatusTag>
            )}

            {children}
          </div>

          {forSaving && (
            <button
              className={`bg-bgSec rounded-12 flex size-40 cursor-pointer items-center justify-center border border-[#E2E2E2] duration-300 outline-none hover:bg-[#F1F1F1] active:inset-shadow-[0_0_0.5rem_rgba(0,0,0,0.1)] ${
                isListType ? '' : 'absolute top-16 right-16'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFav(!isFav);
              }}
            >
              <HugeiconsIcon
                className={`text-iconSec size-16 ${isFav ? 'fill-iconSec' : ''}`}
                icon={StarIcon}
              />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
