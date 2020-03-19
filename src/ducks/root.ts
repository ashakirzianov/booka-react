import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { themeReducer } from './theme';
import { accountReducer, accountEpic } from './account';

export const rootReducer = combineReducers<AppState, AppAction>({
    theme: themeReducer,
    account: accountReducer,
});

export const rootEpic = combineEpics(
    accountEpic,
);
