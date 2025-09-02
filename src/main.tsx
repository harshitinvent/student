import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import GlobalTextContextMenu from './components/features/GlobalTextContextMenu';
import RoutesConfig from './routes/routes';
import { UserProvider } from './providers/user';

import './styles/fonts.css';
import './styles/tailwind.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoutesConfig />
        <GlobalTextContextMenu />
      </UserProvider>
    </BrowserRouter>
   </StrictMode>
);
