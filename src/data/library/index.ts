import { AuthToken } from 'booka-common';
import { booksProvider } from './books';
import { libraryMiscProvider } from './misc';

export function libraryProvider({ token }: {
    token: AuthToken | undefined,
}) {
    return {
        ...booksProvider({ token }),
        ...libraryMiscProvider({ token }),
    };
}
