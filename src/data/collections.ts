import { of, concat } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    AuthToken, CardCollectionName, CardCollection,
} from 'booka-common';
import { Storage, persistentCache } from '../core';
import { libFetcher, backFetcher, optional } from './utils';

const back = backFetcher();
const lib = libFetcher();

export function collectionsProvider({ storage, token }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    const cache = persistentCache<CardCollection>(storage);
    return {
        getCollection(name: CardCollectionName) {
            const actual = name === 'uploads'
                ? optional(token && lib.get('/uploads', {
                    auth: token.token,
                }))
                : optional(token && back.get('/collections', {
                    auth: token.token,
                    query: { name },
                }));
            return concat(
                of(cache.existing(name) ?? { name, cards: [] }),
                actual.pipe(
                    tap(c => cache.add(name, c)),
                ),
            );
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
