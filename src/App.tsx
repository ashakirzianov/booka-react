import React from 'react';
import { Router, HistoryLocation } from '@reach/router';
import { emptyPath, pathFromString, rangeFromString } from 'booka-common';
import { parse } from 'query-string';
import { LibraryScreenComp, BookScreenComp } from './render';
import { ConnectedProvider, useAppDispatch, useAppSelector } from './core';

type RouteProps = {
    path: string,
    location?: HistoryLocation,
    [k: string]: any,
};

function LibraryRoute(_: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch({ type: 'library-fetch' });
    }, [dispatch]);

    return <LibraryScreenComp />;
}

function BookRoute({ bookId, location }: RouteProps) {
    const query = parse(location!.search);
    const pathString = typeof query.p === 'string'
        ? query.p
        : undefined;
    const quoteString = typeof query.q === 'string'
        ? query.q
        : undefined;
    const quoteRange = quoteString
        ? rangeFromString(quoteString)
        : undefined;
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        let path = pathString
            ? pathFromString(pathString)
            : undefined;
        if (!path && quoteString) {
            const range = rangeFromString(quoteString);
            path = range && range.start;
        }
        dispatch({
            type: 'fragment-fetch',
            payload: {
                loc: 'book-pos',
                id: bookId,
                path: path ? path : emptyPath(),
            },
        });
    }, [dispatch, bookId, pathString, quoteString]);
    const fragment = useAppSelector(s => s.currentFragment);
    return <BookScreenComp
        fragment={fragment}
        quoteRange={quoteRange}
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
