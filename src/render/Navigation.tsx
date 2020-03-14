import React, { useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { History } from 'history';

import {
    BookPath, pathToString, BookRange, rangeToString,
} from 'booka-common';
import { WithChildren } from '../atoms';
import { parse, stringify } from 'query-string';

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

export function ShowCardLink({ bookId, children }: WithChildren & {
    bookId: string | undefined,
}) {
    return <UpdateQueryLink queryKey='show' value={bookId}>
        {children}
    </UpdateQueryLink>;
}

export function ShowTocLink({ toShow, children }: WithChildren & {
    toShow: boolean,
}) {
    return <UpdateQueryLink queryKey='toc' value={toShow ? null : undefined}>
        {children}
    </UpdateQueryLink>;
}

function UpdateQueryLink({ queryKey, value, children }: WithChildren & {
    queryKey: string,
    value: string | undefined | null,
}) {
    const location = useLocation();
    const search = updateSearch(location.search, queryKey, value);
    return <Link to={search}>
        {children}
    </Link>;
}

export function useUrlActions() {
    const history = useHistory();

    return useMemo(() => ({
        updateBookPath(path: BookPath | undefined) {
            replaceHistorySearch(history, 'p', path ? pathToString(path) : undefined);
        },
        updateQuoteRange(range: BookRange | undefined) {
            replaceHistorySearch(history, 'q', range ? rangeToString(range) : undefined);
        },
        updateToc(open: boolean) {
            replaceHistorySearch(history, 'toc', open ? null : undefined);
        },
        updateShowCard(bookId: string | undefined) {
            replaceHistorySearch(history, 'show', bookId);
        },
        updateSearchQuery(query: string | undefined) {
            replaceHistorySearch(history, 'q', query);
        },
    }), [history]);
}

function replaceHistorySearch(history: History, key: string, value: string | undefined | null) {
    history.replace({
        ...history.location,
        search: updateSearch(history.location.search, key, value),
    });
}

function updateSearch(search: string, key: string, value: string | undefined | null) {
    const obj = parse(search);
    obj[key] = value;
    const result = stringify(obj);
    return result ? `?${result}` : '';
}
