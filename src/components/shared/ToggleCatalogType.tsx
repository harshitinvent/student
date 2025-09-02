import { GridViewIcon, Menu01Icon } from '@hugeicons/core-free-icons';
import { type CatalogListType, useUserContext } from '../../providers/user';
import Tabs from './Tabs';

export default function ToggleCatalogType({
  className = '',
}: {
  className?: string;
}) {
  const { catalogListType, setCatalogListType } = useUserContext();

  return (
    <Tabs
      className={className}
      activeTabId={catalogListType}
      squareType
      withoutText
      tabsList={[
        {
          id: 'Grid',
          icon: GridViewIcon,
        },
        {
          id: 'List',
          icon: Menu01Icon,
        },
      ]}
      onTabChange={(id) => {
        setCatalogListType(id as CatalogListType);
      }}
    />
  );
}
