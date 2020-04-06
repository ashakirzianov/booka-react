import { parse, stringifyUrl } from 'query-string';
import {
    pathToString, assertNever, pathFromString, rangeFromString,
} from 'booka-common';
import { AppLocation, AppMiddleware } from '../ducks';
import { createBrowserHistory, Location } from 'history';

const history = createBrowserHistory();

export const historySyncMiddleware: AppMiddleware = store => next => action => {
    const nextAction = next(action);
    switch (action.type) {
        case 'location-navigate':
            history.push(linkToUrl(store.getState().location));
            break;
        case 'location-update-path':
        case 'location-update-quote':
        case 'location-update-card':
        case 'location-update-toc':
        case 'location-update-search':
            history.replace(linkToUrl(store.getState().location));
            break;
        default:
            break;
    }
    return nextAction;
};

export function subscribeToHistory(linkDispatch: (link: AppLocation) => void) {
    const link = locationToLink(history.location);
    linkDispatch(link);
}

function locationToLink(location: Location): AppLocation {
    const { toc, q, p, show, refId } = parse(location.search);
    if (location.pathname === '/feed') {
        return {
            location: 'feed',
            card: typeof show === 'string'
                ? show : undefined,
            search: typeof q === 'string'
                ? q : undefined,
        };
    }
    const match = location.pathname.match(/^\/book\/([a-zA-z0-9]+)/);
    if (match && match[1]) {
        const bookId = match[1];
        return {
            location: 'book',
            bookId,
            toc: toc !== undefined,
            path: typeof p === 'string'
                ? pathFromString(p) : undefined,
            quote: typeof q === 'string'
                ? rangeFromString(q) : undefined,
            refId: typeof refId === 'string'
                ? refId : undefined,
        };
    }

    return { location: 'feed' };
}

export function linkToUrl(link: AppLocation) {
    switch (link.location) {
        case 'feed':
            return stringifyUrl({
                url: '/feed',
                query: {
                    show: link.card,
                },
            });
        case 'book':
            return stringifyUrl({
                url: `/book/${link.bookId}`,
                query: {
                    p: link.path
                        ? pathToString(link.path) : undefined,
                    refId: link.refId,
                },
            });
        default:
            assertNever(link);
            return stringifyUrl({
                url: '/feed',
                query: {},
            });
    }
}
