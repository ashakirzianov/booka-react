import { AppAction } from './app';
import { SearchResult } from 'booka-common';

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

export type SearchState =
    | SearchEmptyState | SearchLoadingState | SearchReadyState;

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
export type SearchAction =
    | SearchQueryAction | SearchFulfilledAction;

export function searchReducer(state: SearchState = { state: 'empty' }, action: AppAction): SearchState {
    switch (action.type) {
        case 'search-query':
            return isEmptyQuery(action.payload)
                ? { state: 'empty' }
                : { state: 'loading', query: action.payload };
        case 'search-fulfilled':
            return {
                state: 'ready',
                query: action.payload.query,
                results: action.payload.results,
            };
        default:
            return state;
    }
}

function isEmptyQuery(query: SearchQuery): boolean {
    return query.trim().length === 0;
}
