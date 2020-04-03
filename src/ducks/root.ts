import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { themeReducer } from './theme';
import { accountReducer, accountEpic } from './account';
import { dataEpic } from './data';
import { bookReducer } from './book';

export const rootReducer = combineReducers<AppState, AppAction>({
    theme: themeReducer,
    account: accountReducer,
    book: bookReducer,
});

export const rootEpic = combineEpics(
    accountEpic,
    dataEpic,
);
