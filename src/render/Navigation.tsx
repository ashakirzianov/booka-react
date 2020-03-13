import React, { useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { History } from 'history';

import {
    BookPath, pathToString,
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

type ParamType = string | undefined | null;
export function useHistoryAccess() {
    const history = useHistory();

    return useMemo(() => ({
        replaceSearchParam(key: string, value: ParamType) {
            replaceHistorySearch(history, key, value);
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
