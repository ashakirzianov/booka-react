import React from 'react';
import { Router, Link, HistoryLocation, navigate } from '@reach/router';
import { BookPath, pathToString } from 'booka-common';
import { WithChildren } from './common';

export type RouteProps = {
    path: string,
    location?: HistoryLocation,
    [k: string]: any,
};
export { Link, Router, navigate };

export type BookLinkProps = WithChildren<{
    bookId: string,
    path?: BookPath,
}>;
export function BookLink({ bookId, path, children }: BookLinkProps) {
    const query = path === undefined
        ? ''
        : `?p=${pathToString(path)}`;
    const to = `/book/${bookId}${query}`;
    return <Link
        to={to}
        style={{
            textDecoration: 'none',
            color: undefined,
        }}
    >
        {children}
    </Link>;
}
