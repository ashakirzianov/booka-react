import React, { useMemo } from 'react';
import { BrowserRouter, Route, Switch, useParams, Redirect } from 'react-router-dom';
import { pathFromString } from 'booka-common';

import { View } from '../controls';
import { FeedScreen } from './FeedScreen';
import { BookScreen } from './BookScreen';
import { useQuery } from '../application';

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
    const { toc, p } = useQuery();
    const path = useMemo(
        () => typeof p === 'string' ? pathFromString(p) : undefined,
        [p],
    );

    return <BookScreen
        bookId={bookId}
        showToc={toc !== undefined}
        path={path}
    />;
}
