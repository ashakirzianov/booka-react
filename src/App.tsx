import React from 'react';
import { Router } from '@reach/router';
import { emptyPath, pathFromString } from 'booka-common';
import { parse } from 'query-string';
import { LibraryScreenComp, BookScreenComp } from './render';
import { ConnectedProvider, useAppDispatch, useAppSelector } from './core';

type RouteProps = {
    path: string,
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
    console.log(bookId);
    console.log(location);
    const query = parse(location.search);
    const pathFromQuery = typeof query.p === 'string'
        ? query.p
        : undefined;
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        const path = pathFromQuery
            ? pathFromString(pathFromQuery)
            : undefined;
        dispatch({
            type: 'fragment-fetch',
            payload: {
                loc: 'book-pos',
                id: bookId,
                path: path ? path : emptyPath(),
            },
        });
    }, [dispatch, bookId, pathFromQuery]);
    const fragment = useAppSelector(s => s.currentFragment);
    console.log(fragment);
    return <BookScreenComp
        fragment={fragment}
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
