import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackContract, AuthToken, BookPath, EntitySource, BookmarkPost, ResolvedCurrentPosition } from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';

const back = createFetcher<BackContract>(config().backUrl);

export function getCurrentPositions(token: AuthToken): Observable<ResolvedCurrentPosition[]> {
    return back.get('/current-position', {
        auth: token.token,
    }).pipe(
        map(res => res.value),
    );
}

export function sendCurrentPathUpdate({ bookId, path, source, token }: {
    bookId: string,
    path: BookPath,
    source: EntitySource,
    token: AuthToken,
}) {
    const created = new Date(Date.now());
    return back.put('/current-position', {
        auth: token.token,
        body: {
            source, bookId, path, created,
        },
    });
}

export function getBookmarks(bookId: string, token: AuthToken) {
    return back.get('/bookmarks', {
        auth: token.token,
        query: { bookId },
    }).pipe(
        map(res => res.value),
    );
}

export function sendAddBookmark(bookmark: BookmarkPost, token: AuthToken) {
    return back.post('/bookmarks', {
        auth: token.token,
        body: bookmark,
    });
}

export function sendRemoveBookmark(bookmarkId: string, token: AuthToken) {
    return back.delete('/bookmarks', {
        auth: token.token,
        query: { id: bookmarkId },
    });
}
