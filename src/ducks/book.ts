import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, pathLocator,
} from 'booka-common';
import { fetchBookFragment } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

type BookStateBase = {
    id: string,
    path: BookPath,
    quote?: BookRange,
};
export type BookEmptyState = { state: 'empty' };
export type BookErrorState = BookStateBase & {
    state: 'error',
};
export type BookLoadingState = BookStateBase & {
    state: 'loading',
};
export type BookReadyState = BookStateBase & {
    state: 'ready',
    fragment: BookFragment,
};
export type BookState =
    | BookEmptyState | BookErrorState
    | BookLoadingState | BookReadyState
    ;

export type OpenFragmentAction = {
    type: 'fragment-open',
    payload: {
        id: string,
        path: BookPath,
        quote?: BookRange,
    },
};
export type FetchFragmentFulfilledAction = {
    type: 'fragment-fulfilled',
    payload: {
        id: string,
        path: BookPath,
        fragment: BookFragment,
        quote?: BookRange,
    },
};
export type FetchFragmentRejectedAction = {
    type: 'fragment-rejected',
    payload: {
        id: string,
        path: BookPath,
    },
};
export type SetQuoteRangeAction = {
    type: 'fragment-set-quote',
    payload: BookRange | undefined,
};
export type BookFragmentAction =
    | OpenFragmentAction
    | FetchFragmentFulfilledAction
    | FetchFragmentRejectedAction
    | SetQuoteRangeAction
    ;

const defaultState: BookState = { state: 'empty' };
export function bookReducer(state: BookState = defaultState, action: AppAction): BookState {
    switch (action.type) {
        case 'fragment-open':
            return {
                state: 'loading',
                id: action.payload.id,
                path: action.payload.path,
                quote: action.payload.quote,
            };
        case 'fragment-fulfilled':
            return {
                state: 'ready',
                id: action.payload.id,
                path: action.payload.path,
                fragment: action.payload.fragment,
                quote: action.payload.quote,
            };
        case 'fragment-rejected':
            return {
                state: 'error',
                id: action.payload.id,
                path: action.payload.path,
            };
        case 'fragment-set-quote':
            return state.state === 'ready'
                ? {
                    ...state,
                    quote: action.payload,
                }
                : state;
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('fragment-open'),
    mergeMap(
        action => fetchBookFragment(pathLocator(action.payload.id, action.payload.path)).pipe(
            map((res): AppAction => {
                return {
                    type: 'fragment-fulfilled',
                    payload: {
                        id: action.payload.id,
                        path: action.payload.path,
                        quote: action.payload.quote,
                        fragment: res.value,
                    },
                };
            }),
            catchError(() => of<AppAction>({
                type: 'fragment-rejected',
                payload: {
                    id: action.payload.id,
                    path: action.payload.path,
                },
            })),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
