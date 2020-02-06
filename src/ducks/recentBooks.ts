import { BookPath } from 'booka-common';
import { AppAction, AppState } from './app';
import { combineEpics, Epic } from 'redux-observable';
import { ofAppType } from './utils';
import { mergeMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { getRecentBooks } from '../api/bookmarks';
import { getAuthToken } from './account';
import { of } from 'rxjs';

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

const fetchRecentBooksEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) => action$.pipe(
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

export const recentBooksEpic = combineEpics(
    fetchRecentBooksEpic,
);
