import {
    BookPath, BookRange, pathToString, rangeToString,
} from 'booka-common';
import { stringify } from 'querystring';

export type BookLink = {
    link: 'book',
    bookId: string,
    path?: BookPath,
    refId?: string,
    quote?: BookRange,
    toc?: boolean,
};

export type FeedLink = {
    link: 'feed',
    card?: string,
};

export type AppLink =
    | BookLink | FeedLink;

export function linkToString(link: AppLink): string {
    const query = queryForLink(link);
    const queryString = query
        ? `?${query}`
        : '';
    return `${pathForLink(link)}${queryString}`;
}

export function pathForLink(link: AppLink): string {
    switch (link.link) {
        case 'book':
            return `/book/${link.bookId}`;
        case 'feed':
        default:
            return '/';
    }
}

export function queryForLink(link: AppLink): string {
    const queryObject: { [k: string]: string } = {};
    switch (link.link) {
        case 'book':
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
            break;
        case 'feed':
            if (link.card) {
                queryObject.card = link.card;
            }
            break;
    }

    const query = stringify(queryObject);
    return query;
}
