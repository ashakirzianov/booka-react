import React from 'react';
import { Router, HistoryLocation } from '@reach/router';
import { emptyPath, pathFromString, rangeFromString, BookRange } from 'booka-common';
import { parse } from 'query-string';
import { LibraryScreenComp, BookScreenComp } from './render';
import {
    ConnectedProvider, useAppDispatch, useAppSelector, updateQuote, useTheme,
} from './core';
import { whileDebug } from './config';

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
    const pathString: string | undefined = query.p as any;
    const quoteString: string | undefined = query.q as any;
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
                id: bookId,
                // TODO: handle quote range navigation somewhere else
                path: path || (quoteRange && quoteRange.start) || emptyPath(),
                quote: quoteRange,
            },
        });
    }, [dispatch, bookId, pathString, quoteString]);
    const bookScreen = useAppSelector(s => s.bookScreen);

    const setQuoteRange = React.useCallback((range: BookRange | undefined) => {
        dispatch({
            type: 'fragment-set-quote',
            payload: range,
        });
        updateQuote(range);
    }, [dispatch]);

    const theme = useTheme();
    const controlsVisible = useAppSelector(s => s.controlsVisibility);

    const toggleControls = React.useCallback(() => {
        dispatch({
            type: 'controls-toggle',
        });
    }, [dispatch]);
    return <BookScreenComp
        theme={theme}
        screen={bookScreen}
        controlsVisible={controlsVisible}
        setQuoteRange={setQuoteRange}
        toggleControls={toggleControls}
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

whileDebug(async () => {
    const { default: why } = await import('@welldone-software/why-did-you-render');
    why(React);
});
