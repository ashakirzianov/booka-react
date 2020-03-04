import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, LibraryCard,
} from 'booka-common';
import { BookLink } from '../core';
import { openLink } from '../api';
import { AppAction, AppEpic } from './app';
import { ofAppType } from './utils';

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
    card: LibraryCard,
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
        card: LibraryCard,
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
    payload: {
        preview?: string,
        card: LibraryCard,
        path: BookPath,
    },
};
type ToggleTocAction = {
    type: 'book-toggle-toc',
};
type ToggleControlsAction = {
    type: 'book-toggle-controls',
};
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction | ToggleControlsAction
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
                card: action.payload.card,
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
                    path: action.payload.path,
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

const fetchBookFragmentEpic: AppEpic = (action$) => action$.pipe(
    ofAppType('book-open'),
    mergeMap(
        action => openLink(action.payload).pipe(
            map(({ fragment, card, link }): AppAction => ({
                type: 'book-fetch-fulfilled',
                payload: {
                    fragment, link, card,
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
