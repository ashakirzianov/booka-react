import { bookmarksProvider } from './bookmarks';
import { highlightsProvider } from './highlights';
import { currentPositionsProvider } from './currentPositions';
import { collectionsProvider } from './collections';
import { libraryCard } from './cards';
import { search } from './search';
import { openLink } from './book';
import { createLocalChangeStore } from './localChange';

export type DataProvider = ReturnType<typeof dataProvider>;

// TODO: rename
export function dataProvider() {
    const localChangeStore = createLocalChangeStore();
    return {
        ...bookmarksProvider(localChangeStore),
        ...highlightsProvider(localChangeStore),
        ...currentPositionsProvider(localChangeStore),
        ...collectionsProvider(localChangeStore),
        // TODO: rethink
        openLink,
        search,
        libraryCard,
    };
}
