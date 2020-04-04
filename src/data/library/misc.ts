import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Book, BookPath, LibraryCard, tocForBook, previewForPath,
    AuthToken, BookSearchResult,
} from 'booka-common';
import { Cache } from '../../core';
import { libFetcher } from '../utils';

const lib = libFetcher();

export function libraryMiscProvider({ booksCache, cardsCache, token }: {
    cardsCache: Cache<LibraryCard>,
    booksCache: Cache<Book>,
    token?: AuthToken,
}) {

    return {
        cardForId(bookId: string) {
            const cached = cardsCache.existing(bookId);
            if (cached) {
                return of(cached);
            } else {
                return lib.get('/card', {
                    query: { id: bookId },
                }).pipe(
                    map(card => {
                        cardsCache.add(bookId, card);
                        return card;
                    }),
                );
            }
        },
        textPreview(bookId: string, path: BookPath) {
            const cached = booksCache.existing(bookId);
            if (cached) {
                const preview = previewForPath(cached, path);
                return of(preview);
            } else {
                return lib.get('/preview', {
                    query: { id: bookId, node: path.node },
                }).pipe(
                    map(r => r.preview),
                );
            }
        },
        tableOfContents(bookId: string) {
            const cached = booksCache.existing(bookId);
            if (cached) {
                const toc = tocForBook(cached);
                return of(toc);
            } else {
                return lib.get('/toc', {
                    query: { id: bookId },
                });
            }
        },
        librarySearch(query: string | undefined) {
            if (!query) {
                return of<BookSearchResult[]>();
            }
            return lib.get('/search', {
                auth: token?.token,
                query: { query },
            }).pipe(
                map(r => r.values),
            );
        },
        popularBooks() {
            return lib.get('/popular', {});
        },
        uploadEpub(epubData: any, publicDomain: boolean) {
            if (token) {
                return lib.post('/uploads', {
                    auth: token.token,
                    extra: {
                        postData: epubData,
                    },
                    query: {
                        publicDomain,
                    },
                });
            } else {
                return of<string>();
            }
        },
    };
}
