import { of, Observable } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Epic, combineEpics } from 'redux-observable';
import {
    BookFragment, BookRange, BookPath, firstPath,
} from 'booka-common';
import { getBookFragment, getFragmentWithPathForId } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

export type BookLink = {
    bookId: string,
    path?: BookPath,
    refId?: string,
    quote?: BookRange,
    toc?: boolean,
};

type BookStateBase<K extends string> = BookLink & {
    state: K,
    showControls?: boolean,
    needToScroll?: boolean,
};
export type BookErrorState = BookStateBase<'error'>;
export type BookLoadingState = BookStateBase<'loading'>;
export type BookReadyState = BookStateBase<'ready'> & {
    fragment: BookFragment,
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
export type BookFragmentAction =
    | BookOpenAction
    | BookFetchFulfilledAction
    | BookFetchRejectedAction
    | SetQuoteRangeAction | UpdateCurrentPathAction
    | ToggleTocAction | ToggleControlsAction
    ;

const defaultState: BookState = {
    state: 'loading',
    bookId: '<no-book>',
};
export function bookReducer(state: BookState = defaultState, action: AppAction): BookState {
    switch (action.type) {
        case 'book-open':
            return {
                state: 'loading',
                ...action.payload,
            };
        case 'book-fetch-fulfilled':
            return {
                state: 'ready',
                ...action.payload.link,
                fragment: action.payload.fragment,
                showControls: true,
                needToScroll: true,
            };
        case 'book-fetch-rejected':
            return {
                state: 'error',
                ...action.payload,
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
        case 'book-toggle-toc':
            return state.state === 'ready' && state.fragment.toc
                ? {
                    ...state,
                    toc: !state.toc,
                }
                : state;
        case 'book-toggle-controls':
            return { ...state, showControls: !state.showControls };
        default:
            return state;
    }
}

type FragmentWithLink = {
    fragment: BookFragment,
    link: BookLink,
};
type RefIdLink = BookLink & { refId: string };
function openRefId(link: RefIdLink): Observable<FragmentWithLink> {
    return getFragmentWithPathForId(link.bookId, link.refId).pipe(
        map(({ fragment, path }) => {
            return {
                fragment,
                link: {
                    ...link,
                    path,
                },
            };
        }),
    );
}

type PathLink = BookLink;
function openPath(link: PathLink): Observable<FragmentWithLink> {
    const path = link.path || (link.quote && link.quote.start) || firstPath();
    return getBookFragment(link.bookId, path).pipe(
        map((fragment) => {
            return {
                fragment,
                link: {
                    ...link,
                    path,
                },
            };
        }),
    );
}

function openLink(bookLink: BookLink) {
    const observable = bookLink.refId !== undefined
        // Note: object assign to please TypeScript
        ? openRefId({ ...bookLink, refId: bookLink.refId })
        : openPath(bookLink);
    return observable;
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

export const bookFragmentEpic = combineEpics(
    fetchBookFragmentEpic,
);
