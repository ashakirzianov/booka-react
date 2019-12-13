import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import { SearchResult } from 'booka-common';
import { fetchSearchQuery } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

type SearchQuery = string;
type SearchStateBase<K extends string> = {
    state: K,
};
export type SearchEmptyState = SearchStateBase<'empty'>;
export type SearchLoadingState = SearchStateBase<'loading'> & {
    query: SearchQuery,
};
export type SearchReadyState = SearchStateBase<'ready'> & {
    query: SearchQuery,
    results: SearchResult[],
};
export type SearchErrorState = SearchStateBase<'error'> & {
    query: SearchQuery,
};

export type SearchState =
    | SearchEmptyState | SearchErrorState
    | SearchLoadingState | SearchReadyState
    ;

export type SearchQueryAction = {
    type: 'search-query',
    payload: SearchQuery,
};
export type SearchFulfilledAction = {
    type: 'search-fulfilled',
    payload: {
        query: SearchQuery,
        results: SearchResult[],
    },
};
export type SearchRejectedAction = {
    type: 'search-rejected',
    payload: {
        query: SearchQuery,
    },
};
export type SearchClearAction = {
    type: 'search-clear',
};
export type SearchAction =
    | SearchQueryAction | SearchClearAction
    | SearchFulfilledAction | SearchRejectedAction
    ;

export function searchReducer(state: SearchState = { state: 'empty' }, action: AppAction): SearchState {
    switch (action.type) {
        case 'search-query':
            return {
                state: 'loading',
                query: action.payload,
            };
        case 'search-clear':
            return { state: 'empty' };
        case 'search-fulfilled':
            return {
                state: 'ready',
                query: action.payload.query,
                results: action.payload.results,
            };
        case 'search-rejected':
            return {
                state: 'error',
                query: action.payload.query,
            };
        default:
            return state;
    }
}

const searchQueryEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('search-query'),
    mergeMap(
        action => fetchSearchQuery(action.payload).pipe(
            map(({ value }): AppAction => ({
                type: 'search-fulfilled',
                payload: {
                    query: action.payload,
                    results: value.values,
                },
            })),
            catchError(() => {
                return of<AppAction>({
                    type: 'search-rejected',
                    payload: {
                        query: action.payload,
                    },
                });
            }),
        ),
    ),
);

export const searchEpic = combineEpics(
    searchQueryEpic,
);
