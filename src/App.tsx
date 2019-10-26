import React from 'react';
import { LibraryScreenComp } from './render';
import { ConnectedProvider } from './core';

export const App: React.FC = () => {
  return <ConnectedProvider>
    <LibraryScreenComp />
  </ConnectedProvider>;
}
