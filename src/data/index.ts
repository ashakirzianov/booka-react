import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';
import { currentPositionsProvider } from './currentPositions';
import { collectionsProvider } from './collections';
import { cardsProvider } from './cards';
import { searchProvider } from './search';
import { openLink } from './book';
import { createLocalChangeStore } from './localChange';
import { createApi } from './api';

export type DataProvider = ReturnType<typeof dataProvider>;

// TODO: rename
export function dataProvider() {
    const api = createApi();
    const localChangeStore = createLocalChangeStore();
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
