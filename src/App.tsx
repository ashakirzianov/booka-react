import React from 'react';
import { LibraryScreenComp, BookScreenComp } from './render';
import { ConnectedProvider } from './core';
import { Router } from '@reach/router';
import { BookPositionLocator, emptyPath } from 'booka-common';

type RouteProps = {
  path: string,
  [k: string]: any,
};
function LibraryRoute(_: RouteProps) {
  return <LibraryScreenComp />;
}
function BookRoute({ bookId }: RouteProps) {
  const location: BookPositionLocator = {
    loc: 'book-pos',
    id: bookId,
    path: emptyPath(),
  };
  return <BookScreenComp
    location={location}
  />;
}

export const App: React.FC = () => {
  return <ConnectedProvider>
    <Router>
      <LibraryRoute path='/' />
      <BookRoute path='/book/:bookId' />
    </Router>
  </ConnectedProvider>;
};
