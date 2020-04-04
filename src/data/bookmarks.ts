import { concat } from 'rxjs/operators';
import {
    AuthToken, BackContract, Bookmark,
} from 'booka-common';
import { config } from '../config';
import { Storage, persistentCache } from '../core';
import { createFetcher } from './fetcher';
import { optional, optionalOf } from './utils';

const back = createFetcher<BackContract>(config().backUrl);

export function bookmarksProvider({ token, storage }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    const cache = persistentCache<Bookmark[]>(storage);
    return {
        getBookmarks(bookId: string) {
            return concat(
                optionalOf(cache.existing(bookId)),
                optional(token && back.get('/bookmarks', {
                    auth: token.token,
                    query: { bookId },
                })),
            );
        },
        postAddBookmark(bookmark: Bookmark) {
            return optional(token && back.post('/bookmarks', {
                auth: token.token,
                body: bookmark,
            }));
        },
        postRemoveBookmark(bookmarkId: string) {
            return optional(token && back.delete('/bookmarks', {
                auth: token.token,
                query: { id: bookmarkId },
            }));
        },
    };
}
