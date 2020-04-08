import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {
    BookPath, LibraryCard, tocForBook, previewForPath,
    AuthToken, BookSearchResult,
} from 'booka-common';
import { persistentCache, createStorage } from '../../core';
import { libFetcher } from '../utils';
import { BookStore } from './bookStore';

const lib = libFetcher();

export function libraryMiscProvider({ bookStore, token }: {
    bookStore: BookStore,
    token?: AuthToken,
}) {
    const cardsCache = persistentCache<LibraryCard>(createStorage('<card>'));
    return {
        cardForId(bookId: string) {
            const cached = cardsCache.existing(bookId);
            if (cached) {
                return of(cached);
            } else {
                return lib.get('/cards', {
                    query: { ids: [bookId] },
                }).pipe(
                    map(([card]) => {
                        if (card) {
                            cardsCache.add(bookId, card);
                            return card;
                        } else {
                            return undefined;
                        }
                    }),
                    filter((c): c is LibraryCard => c !== undefined),
                );
            }
        },
        textPreview(bookId: string, path: BookPath) {
            const cached = bookStore.existing(bookId);
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
            const cached = bookStore.existing(bookId);
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
                }).pipe(
                    map(r => r.bookId),
                );
            } else {
                return of<string>();
            }
        },
    };
}
