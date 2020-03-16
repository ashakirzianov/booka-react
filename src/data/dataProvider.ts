import { AuthToken } from 'booka-common';
import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';
import { currentPositionsProvider } from './currentPositions';
import { collectionsProvider } from './collections';
import { cardsProvider } from './cards';
import { searchProvider } from './search';
import { openLink } from './book';
import { createLocalChangeStore } from './localChange';
import { createApi } from './api';
import { postLocalChange } from './post';

export type DataProvider = ReturnType<typeof createDataProvider>;

export function createDataProvider(token: AuthToken | undefined) {
    const api = createApi(token);
    const localChangeStore = createLocalChangeStore({
        post: ch => postLocalChange(api, ch),
        initial: [],
    });
    return {
        ...bookmarksProvider(localChangeStore, api),
        ...highlightsProvider(localChangeStore, api),
        ...currentPositionsProvider(localChangeStore, api),
        ...collectionsProvider(localChangeStore, api),
        ...cardsProvider(api),
        ...searchProvider(api),
        // TODO: rethink
        openLink,
    };
}
