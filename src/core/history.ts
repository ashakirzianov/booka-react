import { createBrowserHistory } from 'history';
import { parse, stringify } from 'query-string';
import { BookPath, pathToString, rangeToString, BookRange } from 'booka-common';
import { throttle } from 'lodash';

export function updateCurrentPath(path: BookPath | undefined) {
    const throttled = throttle(updateQueryParam, 1000);
    throttled('p', path && pathToString(path));
}

export function updateQuote(quote: BookRange | undefined) {
    updateQueryParam('q', quote && rangeToString(quote));
}

const history = createBrowserHistory();
function updateQueryParam(name: string, value: string | undefined) {
    const searchObject = history.location.search
        ? parse(history.location.search)
        : {};

    if (value !== undefined) {
        searchObject[name] = value;
    } else {
        delete searchObject[name];
    }

    history.replace({
        search: stringify(searchObject),
    });
}
