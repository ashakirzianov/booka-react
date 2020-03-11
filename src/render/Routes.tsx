import React from 'react';
import { BrowserRouter, Route, Switch, useParams, useLocation } from 'react-router-dom';

import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';
import { parse } from 'query-string';

export function Routes() {
    return <BrowserRouter>
        <Switch>
            <Route exact path='/' children={<FeedRoute />} />
            <Route path='/book/:bookId' children={<BookRoute />} />
        </Switch>
    </BrowserRouter>;
}

function FeedRoute() {
    const { show } = useQuery();

    return <FeedScreen
        show={typeof show === 'string' ? show : undefined}
    />;
}

function BookRoute() {
    // TODO: make type safe ?
    const { bookId } = useParams<{ bookId: string }>();
    return <BookScreen bookId={bookId} />;
}

function useQuery() {
    const { search } = useLocation();
    const result = parse(search);
    return result;
}