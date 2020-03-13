import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { History } from 'history';

import {
    BookPath, pathToString, BookRange, rangeToString,
} from 'booka-common';
import { WithChildren } from '../atoms';
import { parse, stringify } from 'query-string';

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

export function setBookPathUrl(path: BookPath | undefined, history: History) {
    const p = path ? pathToString(path) : undefined;
    replaceHistorySearch(history, 'p', p);
}

export function setQuoteRangeUrl(range: BookRange | undefined, history: History) {
    const q = range ? rangeToString(range) : undefined;
    replaceHistorySearch(history, 'q', q);
}

export function setSearchQuery(query: string | undefined, history: History) {
    replaceHistorySearch(history, 'q', query);
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
