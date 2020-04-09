import { AuthToken } from 'booka-common';
import { SyncStorage } from '../core';
import { authProvider } from './auth';
import { libraryProvider } from './library';
import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';
import { positionsProvider } from './positions';
import { collectionsProvider } from './collections';

export type DataProvider = ReturnType<typeof createDataProvider>;
export function createDataProvider({ storage, token }: {
    storage: SyncStorage,
    token: AuthToken | undefined,
}) {
    return {
        isSigned() {
            return token !== undefined;
        },
        ...authProvider(),
        ...bookmarksProvider({ token, storage: storage.sub('bookmarks') }),
        ...highlightsProvider({ token, storage: storage.sub('highlights') }),
        ...positionsProvider({ token, storage: storage.sub('positions') }),
        ...collectionsProvider({ token, storage: storage.sub('collections') }),
        ...libraryProvider({ token }),
    };
}
