import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { libraryReducer } from './library';
import { themeReducer } from './theme';
import { bookReducer, bookFragmentEpic } from './book';
import { screenReducer } from './screen';
import { accountReducer, accountEpic } from './account';
import { searchReducer, searchEpic } from './search';
import { currentPositionsEpic, currentPositionsReducer } from './currentPositions';
import { collectionsReducer } from './collections';
import { bookmarksReducer } from './bookmarks';
import { highlightsReducer } from './highlights';
import { syncEpic } from './sync';

export const rootReducer = combineReducers<AppState, AppAction>({
    library: libraryReducer,
    theme: themeReducer,
    book: bookReducer,
    currentPositions: currentPositionsReducer,
    screen: screenReducer,
    account: accountReducer,
    search: searchReducer,
    collections: collectionsReducer,
    bookmarks: bookmarksReducer,
    highlights: highlightsReducer,
});

export const rootEpic = combineEpics(
    bookFragmentEpic,
    accountEpic,
    searchEpic,
    currentPositionsEpic,
    syncEpic,
);
