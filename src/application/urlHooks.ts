import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { parse, stringify } from 'query-string';

import {
    BookPath, pathToString, BookRange, rangeToString,
} from 'booka-common';

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

// TODO: move to utils ?
export function updateSearch(search: string, key: string, value: string | undefined | null) {
    const obj = parse(search);
    obj[key] = value;
    const result = stringify(obj);
    return result ? `?${result}` : '';
}
