import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, Highlight,
} from 'booka-common';
import { openLink, getHighlights } from '../api';
import { AppAction, AppEpic } from './app';
import { ofAppType, appAuth } from './utils';
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
export type BookHighlightsAddAction = {
    type: 'book-highlights-add',
    payload: {
        group: string,
        range: BookRange,
    },
};
export type BookHighlightsFulfilledAction = {
    type: 'book-highlights-fulfilled',
    payload: {
        bookId: string,
        highlights: Highlight[],
    },
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction | ToggleControlsAction
    | BookHighlightsAddAction | BookHighlightsFulfilledAction
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
                highlights: [],
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
        case 'book-highlights-fulfilled':
            return state.link.bookId === action.payload.bookId && state.state === 'ready'
                ? { ...state, highlights: action.payload.highlights }
                : state;
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

const fetchBookHighlightsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-fetch-fulfilled'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => getHighlights(action.payload.link.bookId, token).pipe(
            map((hs): AppAction => ({
                type: 'book-highlights-fulfilled',
                payload: {
                    bookId: action.payload.link.bookId,
                    highlights: hs,
                },
            })),
        ),
    ),
);

// const postHighlightEpic: AppEpic = (action$, state$) => action$.pipe(
//     ofAppType('book-highlights-add'),
//     withLatestFrom(appAuth(state$)),
// );

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
    fetchBookHighlightsEpic,
);
