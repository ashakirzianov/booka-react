import { withLatestFrom, mergeMap, map, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
    BookFragment, BookPath, isPathInFragment, firstPath,
} from 'booka-common';
import { Loadable } from '../core';
import { AppAction, ofAppType, AppEpic } from './app';
import { DataProvider } from '../data';

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
    mergeMap(([{ payload: { path, bookId, refId } }, { book }]) => getBookFragment({
        dataProvider: getCurrentDataProvider(),
        current: book,
        bookId, path, refId,
    }).pipe(
        map((fragment): AppAction => ({
            type: 'book-received',
            payload: {
                fragment, bookId, path, refId,
            },
        })),
        takeUntil(action$.pipe(
            ofAppType('book-req'),
        )),
    )),
);

function getBookFragment({
    dataProvider, current, bookId, path, refId,
}: {
    dataProvider: DataProvider,
    current: BookState,
    bookId: string,
    path?: BookPath,
    refId?: string,
}) {
    if (refId) {
        return dataProvider.fragmentForRef(bookId, refId);
    }
    const actualPath = path || firstPath();
    const needUpdateFragment = current.loading
        || current.bookId !== bookId
        || !isPathInFragment(current.fragment, actualPath)
        ;
    if (needUpdateFragment) {
        return dataProvider.fragmentForPath(bookId, actualPath);
    } else {
        return of<BookFragment>();
    }
}

export const bookEpic = combineEpics(
    requestBookEpic,
);
