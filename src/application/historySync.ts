import { parse, stringifyUrl } from 'query-string';
import {
    pathToString, assertNever, pathFromString, rangeFromString,
} from 'booka-common';
import { AppAction, Link, AppState } from '../ducks';
import { createBrowserHistory, Location } from 'history';

const history = createBrowserHistory();

export function updateHistory(state: AppState, action: AppAction) {
    switch (action.type) {
        case 'link-open': {
            history.push(linkToUrl(state.link));
            return;
        }
        case 'link-update-path': {
            history.replace(linkToUrl(state.link));
            return;
        }
        default:
            return;
    }
}

export function subscribeToHistory(linkDispatch: (link: Link) => void) {
    const link = locationToLink(history.location);
    linkDispatch(link);
}

function locationToLink(location: Location): Link {
    const { toc, q, p, show, refId } = parse(location.search);
    if (location.pathname === '/feed') {
        return {
            link: 'feed',
            show: typeof show === 'string'
                ? show : undefined,
            search: typeof q === 'string'
                ? q : undefined,
        };
    }
    const match = location.pathname.match(/^\/book\/([a-zA-z0-9]+)/);
    if (match && match[1]) {
        const bookId = match[1];
        return {
            link: 'book',
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

    return { link: 'feed' };
}

function linkToUrl(link: Link) {
    switch (link.link) {
        case 'feed':
            return stringifyUrl({
                url: '/feed',
                query: {
                    show: link.show,
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
