import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { AppState, AppAction } from './app';
import { libraryReducer, libraryEpic } from './library';
import { themeReducer } from './theme';
import { bookFragmentReducer, bookFragmentEpic } from './bookFragment';

export const rootReducer = combineReducers<AppState, AppAction>({
    library: libraryReducer,
    theme: themeReducer,
    currentFragment: bookFragmentReducer,
});

export const rootEpic = combineEpics(
    libraryEpic,
    bookFragmentEpic,
);