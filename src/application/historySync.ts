import { parse, stringifyUrl } from 'query-string';
import {
    pathToString, assertNever, pathFromString, rangeFromString, rangeToString,
} from 'booka-common';
import { AppLocation, AppMiddleware } from '../ducks';
import { createBrowserHistory, Location } from 'history';

const history = createBrowserHistory();

export const historySyncMiddleware: AppMiddleware = store => next => action => {
    const nextAction = next(action);
    switch (action.type) {
        case 'location/navigate': {
            if (!action?.meta?.silent) {
                const loc = store.getState().location;
                const url = appLocationToUrl(loc);
                history.push(url);
            }
            break;
        }
        case 'location/update-path':
        case 'location/update-quote':
        case 'location/update-card':
        case 'location/update-toc':
        case 'location/update-search': {
            const loc = store.getState().location;
            const url = appLocationToUrl(loc);
            history.replace(url);
            break;
        }
        default:
            break;
    }
    return nextAction;
};

export function subscribeToHistory(linkDispatch: (link: AppLocation) => void) {
    linkDispatch(browserToAppLocation(history.location));
    history.listen((historyLocation, action) => {
        if (action === 'POP') {
            const link = browserToAppLocation(history.location);
            linkDispatch(link);
        }
    });
}

function browserToAppLocation(location: Location): AppLocation {
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

export function appLocationToUrl(loc: AppLocation) {
    switch (loc.location) {
        case 'feed':
            return stringifyUrl({
                url: '/feed',
                query: {
                    show: loc.card,
                },
            });
        case 'book':
            return stringifyUrl({
                url: `/book/${loc.bookId}`,
                query: {
                    p: loc.path
                        ? pathToString(loc.path) : undefined,
                    q: loc.quote
                        ? rangeToString(loc.quote) : undefined,
                    refId: loc.refId,
                },
            });
        default:
            assertNever(loc);
            return stringifyUrl({
                url: '/feed',
                query: {},
            });
    }
}
