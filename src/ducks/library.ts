import { LibraryCard } from 'booka-common';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { flatMap, map, mergeMap, catchError } from 'rxjs/operators';

import { fetchAllBooks } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

export type LibraryOpenAction = {
    type: 'library-open',
};
export type AllBooksFetchAction = {
    type: 'allbooks-fetch',
    payload?: {
        page: number,
    },
};
export type AllBooksFulfilledAction = {
    type: 'allbooks-fulfilled',
    payload: LibraryCard[],
};
export type AllBooksRejectedAction = {
    type: 'allbooks-rejected',
};

export type LibraryAction =
    | LibraryOpenAction
    | AllBooksFetchAction | AllBooksFulfilledAction | AllBooksRejectedAction
    ;

export type LibraryState = {
    books: LibraryCard[],
};

export function libraryReducer(state: LibraryState = { books: [] }, action: AppAction): LibraryState {
    switch (action.type) {
        case 'allbooks-fulfilled':
            return { books: action.payload };
        default:
            return state;
    }
}

const fetchLibraryEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('library-open'),
    flatMap(() => from<AppAction[]>([
        { type: 'allbooks-fetch' },
    ])),
);

const fetchAllBooksEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('allbooks-fetch'),
    mergeMap(
        () => fetchAllBooks(0).pipe(
            map((res): AppAction => {
                return {
                    type: 'allbooks-fulfilled',
                    payload: res.value.values,
                };
            }),
            catchError((err) => of<AppAction>({
                type: 'allbooks-rejected',
            })),
        ),
    ),
);

export const libraryEpic = combineEpics(
    fetchLibraryEpic,
    fetchAllBooksEpic,
);
