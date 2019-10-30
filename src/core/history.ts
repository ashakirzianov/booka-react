import { createBrowserHistory } from 'history';
import { parse, stringify } from 'query-string';
import { BookPath, pathToString } from 'booka-common';

const history = createBrowserHistory();
export function updateCurrentPath(path: BookPath | undefined) {
    const searchObject = history.location.search
        ? parse(history.location.search)
        : { p: undefined };

    searchObject.p = path === undefined
        ? undefined
        : pathToString(path);

    history.replace({
        search: stringify(searchObject),
    });
}
