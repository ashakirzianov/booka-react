import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { BookPath, pathToString } from 'booka-common';
import { WithChildren } from '../atoms';
import { updateSearch } from '../application';

export function BookPathLink({ bookId, path, children }: WithChildren & {
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
    return <Link to={search} style={{
        textDecoration: 'none',
    }}>
        {children}
    </Link>;
}
