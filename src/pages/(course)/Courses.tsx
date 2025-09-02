import { useState } from 'react';

import { GridViewIcon, Menu01Icon } from '@hugeicons/core-free-icons';

import PageTitleArea from '../../components/shared/PageTitleArea';
import CatalogCard from '../../components/shared/CatalogCard';
import Button from '../../components/shared/Button';
import Toggle from '../../components/shared/Toggle';
import { CatalogListType, useUserContext } from '../../providers/user';
import { Link } from 'react-router';
import Tabs from '../../components/shared/Tabs';
import ToggleCatalogType from '../../components/shared/ToggleCatalogType';
// import Filter from "../../components/shared/Filter";

const catalog = [
  {
    id: '1',
    imgUrl: '/pic/course-1.jpg',
    title: 'Introduction to Psychology',
    subtitle: '12 weeks',
    info: '(24 classes)',
  },
  {
    id: '2',
    imgUrl: '',
    previewColor: 'green',
    title: 'Calculus I',
    subtitle: '12 weeks',
    info: '(24 classes)',
  },
  {
    id: '3',
    imgUrl: '',
    previewColor: 'blue',
    title: 'Fundamentals of Marketing',
    subtitle: '10 weeks',
    info: '(20 classes)',
  },
  {
    id: '4',
    imgUrl: '',
    previewColor: 'orange',
    title: 'Fundamentals of Marketing',
    subtitle: '10 weeks',
    info: '(20 classes)',
  },
  {
    id: '5',
    imgUrl: '',
    previewColor: 'red',
    title: 'Environmental Science & Sustainability ',
    subtitle: '12 weeks',
    info: '(24 classes)',
  },
];

export default function CoursesPage() {
  const { type, catalogListType } = useUserContext();

  return (
    <div className={'relative pb-32'}>
      <PageTitleArea title={'Courses'}>
        <div className={'flex items-center'}>
          {/*<Filter />*/}

          <ToggleCatalogType className={'ml-16'} />

          {type === 'Teacher' && (
            <Link to={'/canvas/12'}>
              <Button className={'ml-24'}>Create Course</Button>
            </Link>
          )}
        </div>
      </PageTitleArea>

      <div
        className={`grid gap-12 px-24 max-md:px-16 ${
          catalogListType === 'Grid' ? 'grid-cols-4 max-md:grid-cols-1' : ''
        }`}
      >
        {catalog.map(
          ({ id, imgUrl, previewColor, title, subtitle, info }, i) => (
            <CatalogCard
              key={'catalog-card-' + id}
              to={`/courses/content`}
              imgUrl={imgUrl}
              previewColor={
                previewColor as 'green' | 'blue' | 'orange' | 'red' | undefined
              }
              title={title}
              subtitle={subtitle}
              info={info}
              isListType={catalogListType === 'List'}
            />
          )
        )}
      </div>
    </div>
  );
}
