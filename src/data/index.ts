import { bookmarksForId } from './bookmarks';
import { highlightsForId } from './highlights';
import { currentPositions } from './currentPositions';
import { openLink } from './book';

export const dataProvider = {
    bookmarksForId,
    highlightsForId,
    currentPositions,
    // TODO: rethink
    openLink,
};

export type DataProvider = typeof dataProvider;
