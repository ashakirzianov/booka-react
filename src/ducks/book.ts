import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, Highlight, HighlightPost, Bookmark, BookmarkPost,
} from 'booka-common';
import { openLink, getHighlights, postHighlight } from '../api';
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
    bookmarks: Bookmark[],
};
export type BookState =
    | BookReadyState
    | BookLoadingState
    | BookErrorState
    ;

type BookOpenAction = {
    type: 'book-open',
    payload: BookLink,
};
type BookFetchFulfilledAction = {
    type: 'book-fetch-fulfilled',
    payload: {
        link: BookLink,
        fragment: BookFragment,
    },
};
type BookFetchRejectedAction = {
    type: 'book-fetch-rejected',
    payload: BookLink,
};
type SetQuoteRangeAction = {
    type: 'book-set-quote',
    payload: BookRange | undefined,
};
type UpdateCurrentPathAction = {
    type: 'book-update-path',
    payload: BookPath,
};
type ToggleTocAction = {
    type: 'book-toggle-toc',
};
type ToggleControlsAction = {
    type: 'book-toggle-controls',
};
type BookHighlightsAddAction = {
    type: 'book-highlights-add',
    payload: {
        highlight: HighlightPost,
    },
};
type BookHighlightsFetchAction = {
    type: 'book-highlights-fetch',
    payload: {
        bookId: string,
    },
};
type BookHighlightsFulfilledAction = {
    type: 'book-highlights-fulfilled',
    payload: {
        bookId: string,
        highlights: Highlight[],
    },
};
type BookmarkAddAction = {
    type: 'book-bm-add',
    payload: {
        bookmark: BookmarkPost,
    },
};
type BookmarkRemoveAction = {
    type: 'book-bm-remove',
    payload: {
        bookmarkId: string,
    },
};
type BookmarksFetchAction = {
    type: 'book-bm-fetch',
    payload: {
        bookId: string,
    },
};
type BookmarksFulfilledAction = {
    type: 'book-bm-fulfilled',
    payload: {
        bookId: string,
        bookmarks: Bookmark[],
    },
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction | ToggleControlsAction
    | BookHighlightsAddAction | BookHighlightsFetchAction | BookHighlightsFulfilledAction
    | BookmarkAddAction | BookmarkRemoveAction | BookmarksFetchAction | BookmarksFulfilledAction
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
                bookmarks: [],
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
        case 'book-bm-fulfilled':
            return state.link.bookId === action.payload.bookId && state.state === 'ready'
                ? { ...state, bookmarks: action.payload.bookmarks }
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

const fetchBookHighlightsEpic: AppEpic = action$ => action$.pipe(
    ofAppType('book-fetch-fulfilled'),
    mergeMap(
        action => of<AppAction>({
            type: 'book-highlights-fetch',
            payload: {
                bookId: action.payload.link.bookId,
            },
        }),
    ),
);

const getHighlightsEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-highlights-fetch'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => getHighlights(action.payload.bookId, token).pipe(
            map((highlights): AppAction => ({
                type: 'book-highlights-fulfilled',
                payload: {
                    bookId: action.payload.bookId,
                    highlights,
                },
            })),
        )
    )
);

const postHighlightEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-highlights-add'),
    withLatestFrom(appAuth(state$)),
    mergeMap(
        ([action, token]) => postHighlight(action.payload.highlight, token).pipe(
            map(
                (): AppAction => ({
                    type: 'book-highlights-fetch',
                    payload: {
                        bookId: action.payload.highlight.location.bookId,
                    },
                }),
            ),
        ),
    ),
);

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
    fetchBookHighlightsEpic,
    getHighlightsEpic,
    postHighlightEpic,
);
