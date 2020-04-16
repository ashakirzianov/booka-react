import { of } from 'rxjs';
import { mergeMap, map, takeUntil } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { SearchResult } from 'booka-common';
import { AppAction, AppEpic, ofAppType } from './app';

type SearchResultReceivedAction = {
    type: 'search/results-received',
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
        case 'location/update-search':
            return action.payload
                ? { state: 'loading' }
                : { state: 'empty' };
        case 'location/navigate':
            return action.payload.location === 'feed' && action.payload.search
                ? { state: 'loading' }
                : { state: 'empty' };;
        case 'search/results-received':
            return { state: 'ready', results: action.payload };
        default:
            return state;
    }
}

const doQueryEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('location/update-search'),
    mergeMap(action =>
        dataProvider().librarySearch(action.payload).pipe(
            map((results): AppAction => ({
                type: 'search/results-received',
                payload: results,
            })),
            takeUntil(action$.pipe(
                ofAppType('location/update-search'),
            )),
        ),
    ),
);

const openQueryEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('location/navigate'),
    mergeMap(action =>
        action.payload.location === 'feed' && action.payload.search !== undefined
            ? dataProvider().librarySearch(action.payload.search).pipe(
                map((results): AppAction => ({
                    type: 'search/results-received',
                    payload: results,
                })),
                takeUntil(action$.pipe(
                    ofAppType('location/update-search'),
                )),
            )
            : of<AppAction>(),
    ),
);

export const searchEpic = combineEpics(
    doQueryEpic,
    openQueryEpic,
);
