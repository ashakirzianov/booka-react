import React from 'react';
import { parse } from 'query-string';
import { pathFromString, rangeFromString } from 'booka-common';
import { BookScreenConnected } from '../render';
import {
    useAppDispatch, BookLink,
} from '../application';
import { RouteProps } from '../atoms';
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

    return <BookScreenConnected />;
}

function buildLink(bookId: string, location: HistoryLocation): BookLink {
    const { p, q, toc } = parse(location!.search);

    return {
        link: 'book',
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
