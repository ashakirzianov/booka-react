import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History } from 'history';
import { parse } from 'query-string';

import {
    BookPath, pathToString, BookRange, rangeToString, rangeFromString, pathFromString,
} from 'booka-common';
import { updateSearch } from './utils';

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
        back() {
            history.goBack();
        },
    }), [history]);
}

export function useUrlQuery() {
    const { search } = useLocation();
    const { q, p, toc, show } = parse(search);

    const quote = useMemo(
        () => typeof q === 'string' ? rangeFromString(q) : undefined,
        [q],
    );
    const path = useMemo(
        () => typeof p === 'string' ? pathFromString(p) : undefined,
        [p],
    );
    const showToc = toc !== undefined;
    const query = typeof q === 'string' ? q : undefined;
    const card = typeof show === 'string' ? show : undefined;
    return { quote, path, showToc, query, card };
}

function replaceHistorySearch(history: History, key: string, value: string | undefined | null) {
    history.replace({
        ...history.location,
        search: updateSearch(history.location.search, key, value),
    });
}
