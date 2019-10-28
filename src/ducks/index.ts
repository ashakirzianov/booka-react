import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { AppState, AppAction } from "./app";
import { libraryReducer, libraryEpic } from "./library";
import { themeReducer } from "./theme";

export * from './app';

export const rootReducer = combineReducers<AppState, AppAction>({
    library: libraryReducer,
    theme: themeReducer,
});

export const rootEpic = combineEpics(
    libraryEpic,
);
