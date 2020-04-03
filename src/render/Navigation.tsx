import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { BookPath, pathToString } from 'booka-common';
import { updateSearch } from '../application';
import { HasChildren } from '../controls';

export function BookPathLink({ bookId, path, children }: HasChildren & {
    bookId: string,
    path?: BookPath,
}) {
    const to = path
        ? `/book/${bookId}?p=${pathToString(path)}`
        : `/book/${bookId}`;
    return <Link to={to} style={{
        textDecoration: 'none',
        minHeight: 0,
        margin: 0,
    }}>
        {children}
    </Link>;
}

export function BookRefLink({ bookId, refId, children }: HasChildren & {
    bookId: string,
    refId: string,
}) {
    const to = `/book/${bookId}?ref=${refId}`;
    return <Link to={to} style={{
        textDecoration: 'none',
        minHeight: 0,
        margin: 0,
    }}>
        {children}
    </Link>;
}

export function FeedLink({ children }: HasChildren) {
    return <Link to='/feed' style={{
        textDecoration: 'none',
        minHeight: 0,
        margin: 0,
    }}>
        {children}
    </Link>;
}

export function ShowCardLink({ bookId, children }: HasChildren & {
    bookId: string | undefined,
}) {
    return <UpdateQueryLink queryKey='show' value={bookId}>
        {children}
    </UpdateQueryLink>;
}

export function ShowTocLink({ toShow, children }: HasChildren & {
    toShow: boolean,
}) {
    return <UpdateQueryLink queryKey='toc' value={toShow ? null : undefined}>
        {children}
    </UpdateQueryLink>;
}

function UpdateQueryLink({ queryKey, value, children }: HasChildren & {
    queryKey: string,
    value: string | undefined | null,
}) {
    const location = useLocation();
    const search = updateSearch(location.search, queryKey, value);
    return <Link to={search} style={{
        textDecoration: 'none',
    }}>
        {children}
    </Link>;
}
