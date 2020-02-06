import { groupBy } from 'lodash';
import { BackContract, AuthToken } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { map } from 'rxjs/operators';
import { RecentBook } from '../ducks';

export function getRecentBooks(token: AuthToken) {
    return fetchCurrentBookmarks(token).pipe(
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
