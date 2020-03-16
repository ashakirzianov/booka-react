import { of, Observable } from 'rxjs';
import { concat, map } from 'rxjs/operators';
import {
    AuthToken, BackContract, LibContract,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
const lib = createFetcher<LibContract>(config().libUrl);

export type Api = ReturnType<typeof createApi>;
export function createApi(token?: AuthToken) {
    return {
        getBookmarks(bookId: string) {
            return withInitial([], token && back.get('/bookmarks', {
                auth: token.token,
                query: { bookId },
            }));
        },
        getHighlights(bookId: string) {
            return withInitial([], token && back.get('/highlights', {
                auth: token.token,
                query: { bookId },
            }));
        },
        getCurrentPositions() {
            return withInitial([], token && back.get('/current-position', {
                auth: token.token,
            }));
        },
        getLibraryCard(bookId: string) {
            return lib.post('/card/batch', {
                body: [{ id: bookId }],
            }).pipe(
                map(res => {
                    const card = res[0]?.card;
                    if (card) {
                        return card;
                    } else {
                        throw new Error(`No book for id: ${bookId}`);
                    }
                })
            );
        },
        getCollections() {
            return withInitial({}, token && back.get('/collections', {
                auth: token.token,
            }));
        },
        getSearchResults(query: string) {
            return withInitial([], lib.get('/search', {
                auth: token?.token,
                query: { query },
            }).pipe(
                map(r => r.values)
            ));
        },
    };
}

// TODO: rethink this
function withInitial<T>(init: T, observable?: Observable<T>): Observable<T> {
    if (observable) {
        return of(init).pipe(
            concat(observable),
        );
    } else {
        return of(init);
    }
}
