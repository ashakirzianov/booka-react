import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, emptyPath,
} from 'booka-common';
import { getBookFragment } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';
import { BookLink } from './bookLink';

type BookStateBase = {
    link: BookLink,
    needToScroll?: boolean,
};
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
    | BookErrorState | BookLoadingState | BookReadyState
    ;

export type BookOpenAction = {
    type: 'book-open',
    payload: BookLink,
};
export type BookFetchFulfilledAction = {
    type: 'book-fetch-fulfilled',
    payload: {
        link: BookLink,
        fragment: BookFragment,
    },
};
export type BookFetchRejectedAction = {
    type: 'book-fetch-rejected',
    payload: BookLink,
};
export type SetQuoteRangeAction = {
    type: 'book-set-quote',
    payload: BookRange | undefined,
};
export type UpdateCurrentPathAction = {
    type: 'book-update-path',
    payload: BookPath,
};
export type ToggleTocAction = {
    type: 'book-toggle-toc',
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction
    ;

const defaultState: BookState = {
    state: 'loading',
    link: { bookId: '<no-book-id>' },
};
export function bookReducer(state: BookState = defaultState, action: AppAction): BookState {
    switch (action.type) {
        case 'book-open':
            return {
                state: 'loading',
                link: action.payload,
            };
        case 'book-fetch-fulfilled':
            return {
                state: 'ready',
                link: action.payload.link,
                fragment: action.payload.fragment,
                needToScroll: true,
            };
        case 'book-fetch-rejected':
            return {
                state: 'error',
                link: action.payload,
            };
        case 'book-set-quote':
            return {
                ...state,
                link: {
                    ...state.link,
                    quote: action.payload,
                },
            };
        case 'book-update-path':
            return {
                ...state,
                link: {
                    ...state.link,
                    path: action.payload,
                },
                needToScroll: false,
            };
        case 'book-toggle-toc':
            return state.state === 'ready' && state.fragment.toc
                ? {
                    ...state,
                    link: {
                        ...state.link,
                        toc: !state.link.toc,
                    },
                }
                : state;
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('book-open'),
    mergeMap(
        action => getBookFragment(action.payload.bookId, action.payload.path || emptyPath()).pipe(
            map((fragment): AppAction => {
                return {
                    type: 'book-fetch-fulfilled',
                    payload: {
                        fragment,
                        link: action.payload,
                    },
                };
            }),
            catchError(() => of<AppAction>({
                type: 'book-fetch-rejected',
                payload: action.payload,
            })),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
