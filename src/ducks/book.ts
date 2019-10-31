import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath,
} from 'booka-common';
import { getBookFragment } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

type BookStateBase = {
    id: string,
    path: BookPath,
    quote?: BookRange,
    needToScroll?: boolean,
};
export type BookEmptyState = { state: 'empty' } & Partial<BookStateBase>;
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

export type BookOpenAction = {
    type: 'book-open',
    payload: {
        id: string,
        path: BookPath,
        quote?: BookRange,
    },
};
export type BookFetchFulfilledAction = {
    type: 'book-fetch-fulfilled',
    payload: {
        id: string,
        path: BookPath,
        fragment: BookFragment,
        quote?: BookRange,
    },
};
export type BookFetchRejectedAction = {
    type: 'book-fetch-rejected',
    payload: {
        id: string,
        path: BookPath,
    },
};
export type SetQuoteRangeAction = {
    type: 'book-set-quote',
    payload: BookRange | undefined,
};
export type UpdateCurrentPathAction = {
    type: 'book-update-path',
    payload: BookPath,
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    ;

const defaultState: BookState = { state: 'empty' };
export function bookReducer(state: BookState = defaultState, action: AppAction): BookState {
    switch (action.type) {
        case 'book-open':
            return {
                state: 'loading',
                id: action.payload.id,
                path: action.payload.path,
                quote: action.payload.quote,
            };
        case 'book-fetch-fulfilled':
            return {
                state: 'ready',
                id: action.payload.id,
                path: action.payload.path,
                fragment: action.payload.fragment,
                quote: action.payload.quote,
                needToScroll: true,
            };
        case 'book-fetch-rejected':
            return {
                state: 'error',
                id: action.payload.id,
                path: action.payload.path,
            };
        case 'book-set-quote':
            return {
                ...state,
                quote: action.payload,
            };
        case 'book-update-path':
            return {
                ...state,
                path: action.payload,
                needToScroll: false,
            };
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('book-open'),
    mergeMap(
        action => getBookFragment(action.payload.id, action.payload.path).pipe(
            map((fragment): AppAction => {
                return {
                    type: 'book-fetch-fulfilled',
                    payload: {
                        fragment,
                        id: action.payload.id,
                        path: action.payload.path,
                        quote: action.payload.quote,
                    },
                };
            }),
            catchError(() => of<AppAction>({
                type: 'book-fetch-rejected',
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
