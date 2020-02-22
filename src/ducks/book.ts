import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, Highlight,
} from 'booka-common';
import { openLink } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';
import { BookLink } from '../core';

type BookStateBase<K extends string> = {
    state: K,
    showControls?: boolean,
    needToScroll?: boolean,
    link: BookLink,
};
export type BookErrorState = BookStateBase<'error'>;
export type BookLoadingState = BookStateBase<'loading'>;
export type BookReadyState = BookStateBase<'ready'> & {
    fragment: BookFragment,
    highlights: Highlight[],
};
export type BookState =
    | BookReadyState
    | BookLoadingState
    | BookErrorState
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
        highlights: Highlight[],
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
export type ToggleControlsAction = {
    type: 'book-toggle-controls',
};
export type BookAddHighlightAction = {
    type: 'book-add-highlight',
    payload: {
        group: string,
        range: BookRange,
    },
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction | ToggleControlsAction
    | BookAddHighlightAction
    ;

const defaultState: BookState = {
    state: 'loading',
    link: {
        link: 'book',
        bookId: '<no-book>',
    },
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
                highlights: action.payload.highlights,
                showControls: true,
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
        case 'book-toggle-controls':
            return { ...state, showControls: !state.showControls };
        default:
            return state;
    }
}

const fetchBookFragmentEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('book-open'),
    mergeMap(
        action => openLink(action.payload).pipe(
            map(({ fragment, link }): AppAction => ({
                type: 'book-fetch-fulfilled',
                payload: {
                    fragment, link,
                    highlights: [],
                },
            })),
            catchError(() => {
                return of<AppAction>({
                    type: 'book-fetch-rejected',
                    payload: action.payload,
                });
            }),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
