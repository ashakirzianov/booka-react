import React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import {
    BookPath, pathToString,
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

export function navigateToBookPath(path: BookPath | undefined, history: History) {

    history.replace({
        ...history.location,
        search: path
            ? `?p=${pathToString(path)}`
            : undefined,
    });
}
