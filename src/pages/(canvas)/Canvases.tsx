import { useState } from 'react';
import { useNavigate } from 'react-router';

import { GridViewIcon, Menu01Icon } from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import CatalogCard from '../../components/shared/CatalogCard';
import Button from '../../components/shared/Button';
import Toggle from '../../components/shared/Toggle';
import Tabs from '../../components/shared/Tabs';
import ToggleCatalogType from '../../components/shared/ToggleCatalogType';
import { useUserContext } from '../../providers/user';
// import Filter from "../../components/shared/Filter";

export default function CanvasCatalogPage() {
  const navigate = useNavigate();
  const { catalogListType } = useUserContext();

  return (
    <>
      <PageTitleArea title={'Canvas'} className={'shrink-0'}>
        <div className={'flex items-center'}>
          {/*<Filter />*/}

          <ToggleCatalogType className={'ml-16'} />
          <Button
            className={'ml-24'}
            onClick={() => {
              navigate('/canvas/12');
            }}
          >
            Create Canvas
          </Button>
        </div>
      </PageTitleArea>

      <div
        className={`grid gap-12 px-24 pb-32 max-md:px-16 ${catalogListType === 'Grid' ? 'md:grid-cols-4' : ''}`}
      >
        <CatalogCard
          to={`/canvas/1`}
          previewColor={'red'}
          title={'Camistry'}
          subtitle={'PDF File'}
          isListType={catalogListType === 'List'}
        />
        <CatalogCard
          to={`/canvas/2`}
          previewColor={'green'}
          title={'Gas Station Icon 1.0'}
          subtitle={'3D Objects'}
          isListType={catalogListType === 'List'}
        />
        <CatalogCard
          to={`/canvas/3`}
          imgUrl={'/pic/canvas-1.png'}
          title={'Gas Station Icon 1.0'}
          subtitle={'3D Objects'}
          isListType={catalogListType === 'List'}
        />
        <CatalogCard
          to={`/canvas/4`}
          previewColor={'orange'}
          title={'Gas Station Icon 1.0'}
          subtitle={'3D Objects'}
          isListType={catalogListType === 'List'}
        />
        <CatalogCard
          to={`/canvas/5`}
          previewColor={'blue'}
          title={'Gas Station Icon 1.0'}
          subtitle={'3D Objects'}
          isListType={catalogListType === 'List'}
        />
      </div>
    </>
  );
}
