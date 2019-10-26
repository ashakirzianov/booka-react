import { combineReducers } from 'redux';
import { AppState, AppAction } from '../model';

function books(state: AppState['books'] = [], action: AppAction) {
    switch (action.type) {
        case 'ALLBOOKS_FULFILLED':
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers<AppState, AppAction>({
    books,
});
