import { bookmarksForId } from './bookmarks';
import { highlightsForId } from './highlights';
import { currentPositions } from './currentPositions';
import { libraryCard } from './cards';
import { openLink } from './book';

export type DataProvider = ReturnType<typeof dataProvider>;

export function dataProvider() {
    return {
        bookmarksForId,
        highlightsForId,
        currentPositions,
        libraryCard,
        // TODO: rethink
        openLink,
    };
}
