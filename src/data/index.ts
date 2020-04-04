import { AuthToken } from 'booka-common';
import { Storage } from '../core';
import { authProvider } from './auth';
import { userDataProvider } from './userData';
import { libraryProvider } from './library';
import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';

export type DataProvider = ReturnType<typeof createDataProvider>;
export function createDataProvider({ storage, token }: {
    storage: Storage,
    token: AuthToken | undefined,
}) {
    return {
        isSigned() {
            return token !== undefined;
        },
        ...authProvider(),
        ...bookmarksProvider({ token, storage: storage.sub('bookmarks') }),
        ...highlightsProvider({ token, storage: storage.sub('highlights') }),
        ...userDataProvider({ token }),
        ...libraryProvider({ token, storage }),
    };
}
