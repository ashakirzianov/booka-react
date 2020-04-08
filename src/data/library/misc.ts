import { of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {
    LibraryCard, AuthToken, BookSearchResult,
} from 'booka-common';
import { persistentCache, createSyncStorage } from '../../core';
import { libFetcher } from '../utils';

const lib = libFetcher();

export function libraryMiscProvider({ token }: {
    token?: AuthToken,
}) {
    const cardsCache = persistentCache<LibraryCard>(createSyncStorage('<card>'));
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
