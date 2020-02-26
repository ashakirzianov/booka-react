import { BookPath, LibraryCard } from 'booka-common';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable';
import { getRecentBooks, sendCurrentPathUpdate } from '../api';
import { AppAction, AppState } from './app';
import { ofAppType, appAuth } from './utils';

export type RecentBookLocation = {
    path: BookPath,
    created: Date,
    preview?: string,
};

export type RecentBook = {
    card: LibraryCard,
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
    payload?: any,
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

const fetchEpic: Epic<AppAction> =
    action$ => action$.pipe(
        ofAppType('account-info'),
        mergeMap(
            action => of<AppAction>({
                type: 'recent-books-fetch',
            }),
        ),
    );

const processFetchEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('recent-books-fetch'),
        withLatestFrom(appAuth(state$)),
        mergeMap(
            ([_, token]) => getRecentBooks(token).pipe(
                map((res): AppAction => {
                    return {
                        type: 'recent-books-fulfilled',
                        payload: res,
                    };
                }),
                catchError(err => {
                    return of<AppAction>({
                        type: 'recent-books-rejected',
                        payload: err,
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
            if (state.account.state === 'signed') {
                sendCurrentPathUpdate({
                    token: state.account.token,
                    bookId: state.book.link.bookId,
                    path: action.payload,
                    source: 'not-implemented',
                }).subscribe();
            }
            return of<AppAction>();
        }),
    );

export const recentBooksEpic = combineEpics(
    fetchEpic,
    processFetchEpic,
    updateCurrentPathEpic,
);
