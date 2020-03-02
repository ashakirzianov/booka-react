import { map } from 'rxjs/operators';
import { BackContract, AuthToken, BookmarkPost } from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';

const back = createFetcher<BackContract>(config().backUrl);

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
