import React from 'react';
import {
    BrowserRouter, Route, Switch, useParams, Redirect,
} from 'react-router-dom';

import { View } from '../controls';
import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';

export function Routes() {
    return <View style={{
        // TODO: check mobile compatibility
        minHeight: '100vh',
    }}>
        <BrowserRouter>
            <Switch>
                <Redirect exact from='/' to='/feed' />
                <Route exact path='/feed' children={<FeedRoute />} />
                <Route path='/book/:bookId' children={<BookRoute />} />
            </Switch>
        </BrowserRouter>
    </View>;
}

function FeedRoute() {
    return <FeedScreen />;
}

function BookRoute() {
    // TODO: make type safe ?
    const { bookId } = useParams<{ bookId: string }>();

    return <BookScreen
        bookId={bookId}
    />;
}
