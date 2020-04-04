import { AuthToken, Book, LibraryCard } from 'booka-common';
import { Storage } from '../storage';
import { cache } from './cache';
import { booksProvider } from './books';
import { libraryMiscProvider } from './misc';

export function libraryProvider({ storage, token }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    const booksCache = cache<Book>(storage.sub('books'));
    const cardsCache = cache<LibraryCard>(storage.sub('cards'));
    return {
        ...booksProvider({ booksCache, token }),
        ...libraryMiscProvider({ booksCache, cardsCache, token }),
    };
}
