import { AuthToken } from 'booka-common';
import { AppStorage } from '../../core';
import { booksProvider } from './books';
import { libraryMiscProvider } from './misc';
import { createBookStore } from './bookStore';

export function libraryProvider({ storage, token }: {
    storage: AppStorage,
    token: AuthToken | undefined,
}) {
    const bookStore = createBookStore();
    return {
        ...booksProvider({ bookStore, token }),
        ...libraryMiscProvider({ bookStore, token }),
    };
}
