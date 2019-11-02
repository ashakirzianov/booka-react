import { createBrowserHistory, LocationDescriptorObject } from 'history';
import { stringify } from 'query-string';
import { pathToString, rangeToString } from 'booka-common';

import { AppState, BookLink } from '../ducks';

const history = createBrowserHistory();
export function updateHistoryFromState(state: AppState) {
    const location = locationForState(state);
    if (location) {
        history.replace(location);
    }
}

function locationForState(state: AppState): LocationDescriptorObject | undefined {
    switch (state.screen) {
        case 'book': {
            const query = queryForLink(state.book);
            return {
                pathname: `/book/${state.book.bookId}`,
                search: query,
            };
        }
        default:
            return undefined;
    }
}

export function linkToString(link: BookLink): string {
    const query = queryForLink(link);
    return `/book/${link.bookId}${query ? '?' + query : ''}`;
}

export function queryForLink(link: BookLink): string {
    const queryObject: { [k: string]: string } = {};
    if (link.path) {
        queryObject.p = pathToString(link.path);
    }
    if (link.refId) {
        queryObject.ref = link.refId;
    }
    if (link.quote) {
        queryObject.q = rangeToString(link.quote);
    }
    if (link.toc) {
        queryObject.toc = 'true';
    }

    const query = stringify(queryObject);
    return query;
}
