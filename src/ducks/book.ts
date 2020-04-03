import { withLatestFrom, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
    BookFragment, BookPath, isPathInFragment, firstPath,
} from 'booka-common';
import { Loadable } from '../core';
import { AppAction, ofAppType, AppEpic } from './app';

export type BookState = Loadable<{
    bookId: string,
    refId: string | undefined,
    fragment: BookFragment,
}>;

type BookRequestAction = {
    type: 'book-req',
    payload: {
        bookId: string,
        path?: BookPath,
        refId?: string,
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
    | BookRequestAction | BookReceivedAction
    ;

const init: BookState = { loading: true };
export function bookReducer(state: BookState = init, action: AppAction): BookState {
    switch (action.type) {
        case 'book-received':
            return {
                bookId: action.payload.bookId,
                fragment: action.payload.fragment,
                refId: action.payload.refId,
            };
        default:
            return state;
    }
}

const requestBookEpic: AppEpic = (action$, state$, { getCurrentDataProvider }) => action$.pipe(
    ofAppType('book-req'),
    withLatestFrom(state$),
    mergeMap(([{ payload: { path, bookId, refId } }, { book }]) => {
        if (refId) {
            return getCurrentDataProvider().fragmentForRef(bookId, refId).pipe(
                map((fragment): AppAction => ({
                    type: 'book-received',
                    payload: {
                        bookId, refId, fragment,
                    },
                })),
            );
        }
        const actualPath = path || firstPath();
        const needUpdateFragment = book.loading
            || book.bookId !== bookId
            || !isPathInFragment(book.fragment, actualPath)
            ;
        if (needUpdateFragment) {
            return getCurrentDataProvider().fragmentForPath(bookId, actualPath).pipe(
                map((fragment): AppAction => ({
                    type: 'book-received',
                    payload: {
                        bookId, fragment,
                    },
                })),
            );
        } else {
            return of<AppAction>();
        }
    }),
);

export const bookEpic = combineEpics(
    requestBookEpic,
);
