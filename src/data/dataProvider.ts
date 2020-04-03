import { SignState } from 'booka-common';
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
import { uploadProvider } from './upload';

export type DataProvider = ReturnType<typeof createDataProvider>;

// TODO: not export
export function createDataProvider(sign: SignState) {
    const token = sign.sign === 'signed'
        ? sign.token : undefined;
    const storageKey = sign.sign === 'signed'
        ? sign.accountInfo._id : undefined;
    const storage = createStorage(storageKey);
    const api = createApi(token);
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
        ...uploadProvider(api),
    };
}

export type UserDataProvider = ReturnType<typeof userDataProvider>;
export function userDataProvider() {
    let currentDataProvider = createDataProvider({ sign: 'not-signed' });
    return {
        getCurrentDataProvider() {
            return currentDataProvider;
        },
        setSign(sign: SignState) {
            currentDataProvider = createDataProvider(sign);
        },
    };
}
