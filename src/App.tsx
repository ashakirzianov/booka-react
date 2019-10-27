import React from 'react';
import { LibraryScreenComp } from './render';
import { ConnectedProvider } from './core';
import { Router } from '@reach/router';

type RouteProps = {
  path: string,
  [k: string]: any,
};
function LibraryRoute(_: RouteProps) {
  return <LibraryScreenComp />;
}

export const App: React.FC = () => {
  return <ConnectedProvider>
    <Router>
      <LibraryRoute path='/' />
    </Router>
  </ConnectedProvider>;
}
