import { combineReducers } from 'redux';
import { AppState, AppAction } from '../model';
import { defaultTheme } from './defaults';

function books(state: AppState['books'] = [], action: AppAction) {
    switch (action.type) {
        case 'allbooks-fulfilled':
            return action.payload;
        default:
            return state;
    }
}

function theme(state: AppState['theme'] = defaultTheme, action: AppAction) {
    return state;
}

export const rootReducer = combineReducers<AppState, AppAction>({
    books,
    theme,
});
