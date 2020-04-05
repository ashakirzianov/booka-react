import { withLatestFrom, mergeMap, map, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
    BookFragment, BookPath, isPathInFragment, firstPath,
} from 'booka-common';
import { Loadable } from '../core';
import { AppAction, ofAppType, AppEpic } from './app';

type BookPositionUpdateAction = {
    type: 'book-position-update',
    payload: {
        bookId: string,
        path?: BookPath,
        refId?: string,
    },
};
type BookRequestAction = {
    type: 'book-req',
    payload: {
        bookId: string,
        path: BookPath,
    },
};
type BookReceivedAction = {
    type: 'book-received',
    payload: {
        bookId: string,
        fragment: BookFragment,
        refId?: string,
    },
};
export type BookAction =
    | BookPositionUpdateAction | BookRequestAction | BookReceivedAction
    ;

export type BookState = {
    bookId: string,
    scrollPath: BookPath | undefined,
    fragment: Loadable<BookFragment>,
};
const init: BookState = {
    bookId: '', // TODO: rethink this
    scrollPath: undefined,
    fragment: { loading: true },
};
export function bookReducer(state: BookState = init, action: AppAction): BookState {
    switch (action.type) {
        case 'book-req':
            return { ...state, scrollPath: action.payload.path };
        case 'book-position-update':
            return state.scrollPath === undefined
                ? state
                : { ...state, scrollPath: undefined };
        case 'book-received':
            return {
                ...state,
                bookId: action.payload.bookId,
                fragment: action.payload.fragment,
            };
        default:
            return state;
    }
}

const changeBookEpic: AppEpic = (action$, state$) => action$.pipe(
    ofAppType('book-position-update'),
    withLatestFrom(state$),
    mergeMap(([{ payload: { path, bookId } }, { book }]) => {
        const actualPath = path || firstPath();
        const needUpdateFragment = book.bookId !== bookId
            || book.fragment.loading
            || !isPathInFragment(book.fragment, actualPath);
        if (needUpdateFragment) {
            return of<AppAction>({
                type: 'book-req',
                payload: { bookId, path: actualPath },
            });
        } else {
            return of<AppAction>();
        }
    }),
);

const requestBookEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('book-req'),
    mergeMap(({ payload: { path, bookId } }) =>
        dataProvider().fragmentForPath(bookId, path).pipe(
            map((fragment): AppAction => ({
                type: 'book-received',
                payload: {
                    fragment, bookId, path,
                },
            })),
            takeUntil(action$.pipe(
                ofAppType('book-req'),
            )),
        )),
);

export const bookEpic = combineEpics(
    changeBookEpic,
    requestBookEpic,
);
