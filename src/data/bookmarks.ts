import { concat, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthToken, Bookmark } from 'booka-common';
import { AppStorage, persistentCache } from '../core';
import { optional, backFetcher } from './utils';

const back = backFetcher();

export function bookmarksProvider({ token, storage }: {
    storage: AppStorage,
    token: AuthToken | undefined,
}) {
    const cache = persistentCache<Bookmark[]>(storage);
    return {
        getBookmarks(bookId: string) {
            return concat(
                of(cache.existing(bookId) ?? []),
                optional(token && back.get('/bookmarks', {
                    auth: token.token,
                    query: { bookId },
                }).pipe(
                    tap(bs => cache.add(bookId, bs)),
                )),
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
