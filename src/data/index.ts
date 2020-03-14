import { bookmarksForId } from './bookmarks';
import { highlightsForId } from './highlights';
import { currentPositions } from './currentPositions';
import { libraryCard } from './cards';
import { search } from './search';
import { openLink } from './book';
import { getCollections } from './collections';

export type DataProvider = ReturnType<typeof dataProvider>;

// TODO: rename
export function dataProvider() {
    return {
        bookmarksForId,
        highlightsForId,
        currentPositions,
        libraryCard,
        search,
        collections: getCollections,
        // TODO: rethink
        openLink,
    };
}
