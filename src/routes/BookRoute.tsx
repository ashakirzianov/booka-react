import React from 'react';
import { parse } from 'query-string';
import {
    pathFromString, rangeFromString, BookRange, BookPath,
} from 'booka-common';
import { BookScreenComp } from '../render';
import {
    useAppDispatch, useAppSelector, useTheme,
} from '../core';
import { RouteProps } from '../atoms';
import { BookLink } from '../ducks';
import { HistoryLocation } from '@reach/router';

export function BookRoute({ bookId, location }: RouteProps) {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        const link = buildLink(bookId, location!);
        dispatch({
            type: 'book-open',
            payload: link,
        });
    }, [dispatch, bookId, location]);
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
    const openRef = React.useCallback((refId: string) => dispatch({
        type: 'book-open',
        payload: {
            bookId,
            refId,
        },
    }), [dispatch, bookId]);

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
        openRef={openRef}
    />;
}

function buildLink(bookId: string, location: HistoryLocation): BookLink {
    const { p, q, toc } = parse(location!.search);

    return {
        bookId,
        path: typeof p === 'string'
            ? pathFromString(p)
            : undefined,
        quote: typeof q === 'string'
            ? rangeFromString(q)
            : undefined,
        toc: toc === 'true' ? true : false,
    };
}
