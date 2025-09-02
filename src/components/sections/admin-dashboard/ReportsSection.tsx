import Dropdown from '../../shared/Dropdown';
import { UserIcon } from '@hugeicons/core-free-icons';
import CatalogCard from '../../shared/CatalogCard';
import MemberAvatars from '../../shared/MemberAvatars';

const filter = ['Filter', '1', '2'];

export default function ReportsSection() {
  return (
    <div>
      <div className={'flex items-center justify-start gap-16 max-md:px-16'}>
        <Dropdown
          direction={'down'}
          icon={UserIcon}
          list={filter}
          className={'min-w-131'}
        />
      </div>

      <div
        className={
          'mt-12 grid gap-16 max-md:gap-12 max-md:px-16 md:grid-cols-4'
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
            >
              <div className={'mt-12 flex items-center justify-between gap-12'}>
                <MemberAvatars size={'sm'} />
                <p className={'text-textHeadline text-body-l font-medium'}>
                  05/07/25
                </p>
              </div>
            </CatalogCard>
          ))}
      </div>
    </div>
  );
}
