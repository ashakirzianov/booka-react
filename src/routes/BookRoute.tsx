import React from 'react';
import { parse } from 'query-string';
import {
    emptyPath, pathFromString, rangeFromString, BookRange, BookPath,
} from 'booka-common';
import { BookScreenComp } from '../render';
import {
    useAppDispatch, useAppSelector, useTheme,
} from '../core';
import { RouteProps } from '../atoms';

export function BookRoute({ bookId, location }: RouteProps) {
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
            type: 'book-open',
            payload: {
                bookId,
                // TODO: handle quote range navigation somewhere else
                path: path || (quoteRange && quoteRange.start) || emptyPath(),
                quote: quoteRange,
            },
        });
    }, [dispatch, bookId, pathString, quoteString]);
    const bookScreen = useAppSelector(s => s.book);

    const setQuoteRange = React.useCallback((range: BookRange | undefined) => dispatch({
        type: 'book-set-quote',
        payload: range,
    }), [dispatch]);
    const updateCurrentPath = React.useCallback((path: BookPath) => dispatch({
        type: 'book-update-path',
        payload: path,
    }), [dispatch]);
    const toggleControls = React.useCallback(() => dispatch({
        type: 'controls-toggle',
    }), [dispatch]);
    const toggleToc = React.useCallback(() => dispatch({
        type: 'book-toggle-toc',
    }), [dispatch]);

    const theme = useTheme();
    const controlsVisible = useAppSelector(s => s.controlsVisibility);
    return <BookScreenComp
        theme={theme}
        screen={bookScreen}
        controlsVisible={controlsVisible}
        updateCurrentPath={updateCurrentPath}
        setQuoteRange={setQuoteRange}
        toggleControls={toggleControls}
        toggleToc={toggleToc}
    />;
}
