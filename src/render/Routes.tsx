import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LibraryScreen } from './LibraryScreen';
import { BookScreen } from './BookScreen';

export function Routes() {
    return <BrowserRouter>
        <Switch>
            <Route exact path='/' children={<LibraryScreen />} />
            <Route path='/book/:bookId' children={<BookScreen />} />
        </Switch>
    </BrowserRouter>;
}
