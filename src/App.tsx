import React from 'react';
import { Router, HistoryLocation } from '@reach/router';
import { emptyPath, pathFromString, rangeFromString, BookRange } from 'booka-common';
import { parse } from 'query-string';
import { LibraryScreenComp, BookScreenComp } from './render';
import {
    ConnectedProvider, useAppDispatch, useAppSelector, updateQuote,
} from './core';

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
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        const path = pathString
            ? pathFromString(pathString)
            : undefined;
        const quoteRange = quoteString
            ? rangeFromString(quoteString)
            : undefined;
        dispatch({
            type: 'fragment-open',
            payload: {
                location: {
                    loc: 'book-pos',
                    id: bookId,
                    path: path || (quoteRange && quoteRange.start) || emptyPath(),
                },
                quote: quoteRange,
            },
        });
    }, [dispatch, bookId, pathString, quoteString]);
    const fragment = useAppSelector(s => s.currentFragment);

    const setQuoteRange = React.useCallback((range: BookRange | undefined) => {
        dispatch({
            type: 'fragment-set-quote',
            payload: range,
        });
        updateQuote(range);
    }, [dispatch]);
    return <BookScreenComp
        fragment={fragment}
        setQuoteRange={setQuoteRange}
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
