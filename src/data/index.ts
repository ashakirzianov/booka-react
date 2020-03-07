import { bookmarksForId } from './bookmarks';
import { highlightsForId } from './highlights';
import { currentPositions } from './currentPositions';
import { openLink } from './book';

export type DataProvider = ReturnType<typeof dataProvider>;

export function dataProvider() {
    return {
        bookmarksForId,
        highlightsForId,
        currentPositions,
        // TODO: rethink
        openLink,
    };
}
