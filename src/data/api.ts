import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    AuthToken, BackContract, LibContract,
    Bookmark, Highlight, HighlightUpdate,
    CardCollectionName, CurrentPositionPost, BookPath, pathToString,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
const lib = createFetcher<LibContract>(config().libUrl);

// TODO: rethink location
export function createAuthApi() {
    return {
        getAuthFbToken(token: string) {
            return back.get('/auth/fbtoken', {
                query: {
                    token,
                },
            });
        },
        getAccountInfo(token: AuthToken) {
            return back.get('/me/info', {
                auth: token.token,
            });
        },
    };
}

export type Api = ReturnType<typeof createApi>;
export function createApi(token?: AuthToken) {
    return {
        getFragment(bookId: string, path: BookPath) {
            return lib.get('/fragment', {
                auth: token?.token,
                query: {
                    id: bookId,
                    path: pathToString(path),
                },
            }).pipe(
                map(r => r.fragment),
            );
        },
        getBook(bookId: string) {
            return lib.get('/full', {
                query: { id: bookId },
            }).pipe(
                map(r => r.book),
            );
        },
        getPreview(bookId: string, path: BookPath) {
            return lib.get('/preview', {
                query: { id: bookId, node: path.node },
            }).pipe(
                map(r => r.preview),
            );
        },
        getToc(bookId: string) {
            return lib.get('/toc', {
                query: { id: bookId },
            });
        },
        getBookmarks(bookId: string) {
            return optional(token && back.get('/bookmarks', {
                auth: token.token,
                query: { bookId },
            }));
        },
        getHighlights(bookId: string) {
            return optional(token && back.get('/highlights', {
                auth: token.token,
                query: { bookId },
            }));
        },
        getCurrentPositions() {
            return optional(token && back.get('/current-position', {
                auth: token.token,
            }));
        },
        getLibraryCard(bookId: string) {
            return lib.get('/card', {
                query: { id: bookId },
            });
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
        getSearchResults(query: string) {
            return lib.get('/search', {
                auth: token?.token,
                query: { query },
            }).pipe(
                map(r => r.values),
            );
        },
        getPopularBooks() {
            return lib.get('/popular', {});
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
        postAddCurrentPosition(position: CurrentPositionPost) {
            return optional(token && back.put('/current-position', {
                auth: token.token,
                body: position,
            }));
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
        uploadBook(bookData: any, publicDomain: boolean) {
            return optional(token && lib.post('/uploads', {
                auth: token.token,
                extra: {
                    postData: bookData,
                },
                query: {
                    publicDomain,
                },
            }));
        },
    };
}

function optional<T>(observable?: Observable<T>): Observable<T> {
    return observable ?? of<T>();
}
