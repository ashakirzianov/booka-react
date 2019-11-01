import {
    BookPath, BookRange, pathToString, rangeToString,
} from 'booka-common';
import { stringify } from 'query-string';

export type BookLink = {
    bookId: string,
    path?: BookPath,
    refId?: string,
    quote?: BookRange,
    toc?: boolean,
};

export function linkToString(link: BookLink): string {
    const query = queryForLink(link);
    return `/book/${link.bookId}${query}`;
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
    // TODO: support toc on link

    const query = stringify(queryObject);
    return query
        ? `?${query}`
        : '';
}
