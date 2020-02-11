import { groupBy } from 'lodash';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackContract, AuthToken, BookPath, BookmarkSource } from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';
import { RecentBook } from '../ducks';

export function getRecentBooks(token: AuthToken | undefined): Observable<RecentBook[]> {
    return token === undefined
        ? of([])
        : fetchCurrentBookmarks(token).pipe(
            map((res): RecentBook[] => {
                const all = res.value;
                const grouped = groupBy(all, val => val.location.bookId);
                const recentBooks: RecentBook[] = Object.entries(grouped).map(([bookId, bookmarks]) => ({
                    id: bookId,
                    locations: bookmarks.map(bookmark => ({
                        path: bookmark.location.path,
                        created: bookmark.created,
                        preview: 'to-implement',
                    })),
                }));
                return recentBooks;
            })
        );
}

const fetcher = createFetcher<BackContract>(config().backUrl);
function fetchCurrentBookmarks(token: AuthToken) {
    return fetcher.get('/bookmarks/current', { auth: token.token });
}

export function putCurrentBookUpdate(bookId: string, path: BookPath, source: BookmarkSource, token: AuthToken) {
    const created = new Date(Date.now());
    return fetcher.put('/bookmarks/current', {
        auth: token.token,
        body: {
            source,
            location: {
                bookId, path,
            },
            created,
        },
    });
}
