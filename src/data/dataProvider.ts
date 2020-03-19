import { AuthToken } from 'booka-common';
import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';
import { currentPositionsProvider } from './currentPositions';
import { collectionsProvider } from './collections';
import { searchProvider } from './search';
import { createLocalChangeStore } from './localChange';
import { createApi } from './api';
import { postLocalChange } from './post';
import { createStorage } from './storage';
import { libraryProvider } from './library';

export type DataProvider = ReturnType<typeof createDataProvider>;

export type UserInfo = {
    token: AuthToken,
    accountId: string,
};
export function createDataProvider(info: UserInfo | undefined) {
    const storage = createStorage(info?.accountId);
    const api = createApi(info?.token);
    const localChangeStore = createLocalChangeStore({
        post: ch => postLocalChange(api, ch),
        storage: storage.cell('local-changes'),
    });
    return {
        ...bookmarksProvider(localChangeStore, api),
        ...highlightsProvider(localChangeStore, api),
        ...currentPositionsProvider(localChangeStore, api),
        ...collectionsProvider(localChangeStore, api),
        ...searchProvider(api),
        ...libraryProvider(api, storage.sub('library')),
    };
}
