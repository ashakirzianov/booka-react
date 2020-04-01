import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch, useParams, useLocation, Redirect } from 'react-router-dom';
import { parse } from 'query-string';
import { pathFromString, rangeFromString } from 'booka-common';

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
    const { show, q } = useQuery();

    return <FeedScreen
        show={typeof show === 'string' ? show : undefined}
        query={typeof q === 'string' ? q : undefined}
    />;
}

function BookRoute() {
    // TODO: make type safe ?
    const { bookId } = useParams<{ bookId: string }>();
    const { toc, p, q } = useQuery();
    const path = useMemo(
        () => typeof p === 'string' ? pathFromString(p) : undefined,
        [p],
    );
    const quote = typeof q === 'string' ? rangeFromString(q) : undefined;

    return <BookScreen
        bookId={bookId}
        showToc={toc !== undefined}
        path={quote?.start ?? path}
        quote={quote}
    />;
}

function useQuery() {
    const { search } = useLocation();
    // TODO: do we really need this ?
    const result = useMemo(
        () => parse(search),
        [search],
    );
    return result;
}
