import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { libraryReducer, libraryEpic } from './library';
import { themeReducer } from './theme';
import { bookReducer, bookFragmentEpic } from './book';
import { screenReducer } from './screen';
import { accountReducer, accountEpic } from './account';
import { searchReducer, searchEpic } from './search';
import { recentBooksEpic, recentBooksReducer } from './recentBooks';
import { collectionsReducer, collectionsEpic } from './collections';
import { bookmarksReducer, bookmarksEpic } from './bookmarks';
import { highlightsReducer, highlightsEpic } from './highlights';

export const rootReducer = combineReducers<AppState, AppAction>({
    library: libraryReducer,
    theme: themeReducer,
    book: bookReducer,
    recentBooks: recentBooksReducer,
    screen: screenReducer,
    account: accountReducer,
    search: searchReducer,
    collections: collectionsReducer,
    bookmarks: bookmarksReducer,
    highlights: highlightsReducer,
});

export const rootEpic = combineEpics(
    libraryEpic,
    bookFragmentEpic,
    accountEpic,
    searchEpic,
    recentBooksEpic,
    collectionsEpic,
    bookmarksEpic,
    highlightsEpic,
);
