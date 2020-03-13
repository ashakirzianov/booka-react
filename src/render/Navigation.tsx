import React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import {
    BookPath, pathToString, BookRange, rangeToString,
} from 'booka-common';
import { WithChildren } from '../atoms';

// TODO: find better location
// TODO: fix naming
export function LinkToPath({ bookId, path, children }: WithChildren & {
    bookId: string,
    path?: BookPath,
}) {
    const to = path
        ? `/book/${bookId}?p=${pathToString(path)}`
        : `/book/${bookId}`;
    return <Link to={to}>
        {children}
    </Link>;
}

export function setBookPathUrl(path: BookPath | undefined, history: History) {

    history.replace({
        ...history.location,
        search: path
            ? `?p=${pathToString(path)}`
            : undefined,
    });
}

export function setQuoteRangeUrl(range: BookRange | undefined, history: History) {
    history.replace({
        ...history.location,
        search: range
            ? `?q=${rangeToString(range)}`
            : undefined,
    });
}

export function setSearchQuery(query: string | undefined, history: History) {
    history.replace({
        ...history.location,
        search: query
            ? `?q=${query}`
            : undefined,
    });
}
