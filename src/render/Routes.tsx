import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';

export function Routes() {
    return <BrowserRouter>
        <Switch>
            <Route exact path='/' children={<FeedScreen />} />
            <Route path='/book/:bookId' children={<BookScreen />} />
        </Switch>
    </BrowserRouter>;
}
