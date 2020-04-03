import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { themeReducer } from './theme';
import { accountReducer, accountEpic } from './account';
import { dataEpic } from './data';
import { bookReducer, bookEpic } from './book';
import { bookmarksReducer, bookmarksEpic } from './bookmarks';
import { highlightsReducer, highlightsEpic } from './highlights';
import { collectionsReducer, collectionsEpic } from './collections';

export const rootReducer = combineReducers<AppState, AppAction>({
    theme: themeReducer,
    account: accountReducer,
    book: bookReducer,
    bookmarks: bookmarksReducer,
    highlights: highlightsReducer,
    collections: collectionsReducer,
});

export const rootEpic = combineEpics(
    dataEpic,
    accountEpic,
    bookEpic,
    bookmarksEpic,
    highlightsEpic,
    collectionsEpic,
);
