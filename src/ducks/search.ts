import { of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { SearchResult } from 'booka-common';
import { AppAction, AppEpic, ofAppType } from './app';

type SearchResultReceivedAction = {
    type: 'search-results-received',
    payload: SearchResult[],
};

export type SearchAction =
    | SearchResultReceivedAction;

export type SearchState = {
    state: 'empty',
} | {
    state: 'loading',
} | {
    state: 'ready',
    results: SearchResult[],
};
const init: SearchState = { state: 'empty' };
export function searchReducer(state: SearchState = init, action: AppAction): SearchState {
    switch (action.type) {
        case 'location-update':
            if (action.payload.location === 'feed' && ('search' in action.payload)) {
                return action.payload.search
                    ? { state: 'loading' }
                    : { state: 'empty' };
            } else {
                return state;
            }
        case 'search-results-received':
            return { state: 'ready', results: action.payload };
        default:
            return state;
    }
}

const doQueryEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('location-update'),
    mergeMap(action => {
        console.log('ONE');
        if (action.payload.location === 'feed' && ('search' in action.payload)) {
            console.log('TWO');
            return dataProvider().librarySearch(action.payload.search).pipe(
                map((results): AppAction => ({
                    type: 'search-results-received',
                    payload: results,
                })),
            );
        } else {
            return of<AppAction>();
        }
    }),
);

export const searchEpic = combineEpics(
    doQueryEpic,
);
