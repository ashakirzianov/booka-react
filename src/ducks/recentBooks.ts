import { BookPath } from 'booka-common';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable';
import { getRecentBooks, putCurrentPathUpdate } from '../api/bookmarks';
import { AppAction, AppState } from './app';
import { ofAppType } from './utils';
import { getAuthToken } from './account';

export type RecentBookLocation = {
    path: BookPath,
    created: Date,
    preview?: string,
};

export type RecentBook = {
    id: string,
    locations: RecentBookLocation[],
};

export type RecentBooksState = RecentBook[];

export type RecentBooksFetchAction = {
    type: 'recent-books-fetch',
};
export type RecentBooksFulfilledAction = {
    type: 'recent-books-fulfilled',
    payload: RecentBook[],
};
export type RecentBooksRejectedAction = {
    type: 'recent-books-rejected',
};
export type RecentBooksAction =
    | RecentBooksFetchAction
    | RecentBooksFulfilledAction
    | RecentBooksRejectedAction
    ;

export function recentBooksReducer(state: RecentBooksState = [], action: AppAction): RecentBooksState {
    switch (action.type) {
        case 'recent-books-fulfilled':
            return action.payload;
        default:
            return state;
    }
}

const fetchRecentBooksEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('recent-books-fetch'),
        withLatestFrom(state$),
        mergeMap(
            ([_, state]) => getRecentBooks(getAuthToken(state.account)).pipe(
                map((res): AppAction => {
                    return {
                        type: 'recent-books-fulfilled',
                        payload: res,
                    };
                }),
                catchError(() => {
                    return of<AppAction>({
                        type: 'recent-books-rejected',
                    });
                }),
            ),
        ),
    );

const updateCurrentPathEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('book-update-path'),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            const token = getAuthToken(state.account);
            if (token !== undefined) {
                putCurrentPathUpdate({
                    token,
                    bookId: state.book.bookId,
                    path: action.payload,
                    source: 'not-implemented',
                });
            }
            return of<AppAction>();
        }),
    );

export const recentBooksEpic = combineEpics(
    fetchRecentBooksEpic,
    updateCurrentPathEpic,
);
