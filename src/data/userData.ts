import { of, Observable } from 'rxjs';
import {
    AuthToken, BackContract, LibContract, Bookmark,
    Highlight, HighlightUpdate, CardCollectionName, CurrentPositionPost,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
const lib = createFetcher<LibContract>(config().libUrl);

export function userDataProvider({ token }: {
    token: AuthToken | undefined,
}) {
    return {
        getBookmarks(bookId: string) {
            return optional(token && back.get('/bookmarks', {
                auth: token.token,
                query: { bookId },
            }));
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

        getHighlights(bookId: string) {
            return optional(token && back.get('/highlights', {
                auth: token.token,
                query: { bookId },
            }));
        },
        postAddHighlight(highlight: Highlight) {
            return optional(token && back.post('/highlights', {
                auth: token.token,
                body: highlight,
            }));
        },
        postRemoveHighlight(highlightId: string) {
            return optional(token && back.delete('/highlights', {
                auth: token.token,
                query: { highlightId },
            }));
        },
        postUpdateHighlight(update: HighlightUpdate) {
            return optional(token && back.patch('/highlights', {
                auth: token.token,
                body: update,
            }));
        },

        getCurrentPositions() {
            return optional(token && back.get('/current-position', {
                auth: token.token,
            }));
        },
        postAddCurrentPosition(position: CurrentPositionPost) {
            return optional(token && back.put('/current-position', {
                auth: token.token,
                body: position,
            }));
        },

        getCollection(name: CardCollectionName) {
            if (name === 'uploads') {
                return optional(token && lib.get('/uploads', {
                    auth: token.token,
                }));
            } else {
                return optional(token && back.get('/collections', {
                    auth: token.token,
                    query: { name },
                }));
            }
        },
        postAddToCollection(bookId: string, collection: CardCollectionName) {
            return optional(token && back.post('/collections', {
                auth: token.token,
                query: { bookId, collection },
            }));
        },
        postRemoveFromCollection(bookId: string, collection: CardCollectionName) {
            return optional(token && back.delete('/collections', {
                auth: token.token,
                query: { bookId, collection },
            }));
        },
    };
}

function optional<T>(observable?: Observable<T>): Observable<T> {
    return observable ?? of<T>();
}
