import { AuthToken, Book, LibraryCard } from 'booka-common';
import { Storage } from '../../core';
import { persistentCache } from '../cache';
import { booksProvider } from './books';
import { libraryMiscProvider } from './misc';

export function libraryProvider({ storage, token }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    const booksCache = persistentCache<Book>(storage.sub('books'));
    const cardsCache = persistentCache<LibraryCard>(storage.sub('cards'));
    return {
        ...booksProvider({ booksCache, token }),
        ...libraryMiscProvider({ booksCache, cardsCache, token }),
    };
}
