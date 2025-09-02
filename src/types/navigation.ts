import { type IconSvgElement } from '@hugeicons/react';
import { type NavigateProps } from 'react-router';

export type NavigationItemType = {
  id: string | number;
  name: string;
  icon: IconSvgElement;
  path: NavigateProps['to'];
  component?: React.ComponentType;
  layout?: React.ComponentType;
  sublist?: Array<{
    name: string;
    path: string;
    component?: React.ComponentType;
  }>;
};
