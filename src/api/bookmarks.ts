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
                return all.map(b => ({
                    card: b.card,
                    locations: b.locations.map(l => ({
                        path: l.path,
                        created: l.created,
                        preview: l.preview,
                    })),
                }));
            }),
        );
}

const back = createFetcher<BackContract>(config().backUrl);
function fetchCurrentBookmarks(token: AuthToken) {
    return back.get('/bookmarks/current', { auth: token.token });
}

type CurrentPathUpdate = {
    bookId: string,
    path: BookPath,
    source: BookmarkSource,
    token: AuthToken,
};
export function sendCurrentPathUpdate({ bookId, path, source, token }: CurrentPathUpdate) {
    const created = new Date(Date.now());
    return back.put('/bookmarks/current', {
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
