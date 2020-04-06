import { of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { BookSearchResult } from 'booka-common';
import { Loadable } from '../core';
import { AppAction, AppEpic, ofAppType } from './app';

type SearchResultReceivedAction = {
    type: 'search-results-received',
    payload: BookSearchResult[],
};

export type SearchAction =
    | SearchResultReceivedAction;

export type SearchState = {
    results: Loadable<BookSearchResult[]>,
};
const init: SearchState = { results: [] };
export function searchReducer(state: SearchState = init, action: AppAction): SearchState {
    switch (action.type) {
        case 'location-update':
            if (action.payload.location === 'feed' && action.payload.search !== undefined) {
                return { results: { loading: true } };
            } else {
                return state;
            }
        case 'search-results-received':
            return { results: action.payload };
        default:
            return state;
    }
}

const doQueryEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('location-update'),
    mergeMap(action => {
        if (action.payload.location === 'feed' && action.payload.search) {
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
