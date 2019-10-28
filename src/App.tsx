import React from 'react';
import { LibraryScreenComp, BookScreenComp } from './render';
import { ConnectedProvider, useAppDispatch, useAppSelector } from './core';
import { Router } from '@reach/router';
import { emptyPath } from 'booka-common';

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

function BookRoute({ bookId }: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch({
            type: 'fragment-fetch',
            payload: {
                loc: 'book-pos',
                id: bookId,
                path: emptyPath(),
            },
        });
    }, [dispatch, bookId]);
    const fragment = useAppSelector(s => s.currentFragment);
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
