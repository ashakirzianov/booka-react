import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { themeReducer } from './theme';
import { accountReducer, accountEpic } from './account';
import { dataEpic } from './data';
import { bookReducer, bookEpic } from './book';
import { bookmarksReducer, bookmarksEpic } from './bookmarks';

export const rootReducer = combineReducers<AppState, AppAction>({
    theme: themeReducer,
    account: accountReducer,
    book: bookReducer,
    bookmarks: bookmarksReducer,
});

export const rootEpic = combineEpics(
    dataEpic,
    accountEpic,
    bookEpic,
    bookmarksEpic,
);
