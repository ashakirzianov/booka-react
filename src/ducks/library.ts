import { BookDesc } from 'booka-common';
import { combineEpics, Epic } from 'redux-observable';
import { from } from 'rxjs';
import { filter, flatMap, map, mergeMap } from 'rxjs/operators';

import { fetchAllBooks } from '../api';
import { AppAction } from './app';
import { ofAppType } from './utils';

export type LibraryFetchAction = {
    type: 'library-fetch',
};

export type AllBooksFetchAction = {
    type: 'allbooks-fetch',
    payload?: {
        page: number,
    },
};

export type AllBooksFulfilledAction = {
    type: 'allbooks-fulfilled',
    payload: BookDesc[],
};

export type LibraryAction =
    | LibraryFetchAction | AllBooksFetchAction | AllBooksFulfilledAction
    ;

export type LibraryState = {
    books: BookDesc[],
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
    ofAppType('library-fetch'),
    flatMap(() => from<AppAction[]>([
        { type: 'allbooks-fetch' },
    ])),
);

const fetchAllBooksEpic: Epic<AppAction> = (action$) => action$.pipe(
    ofAppType('allbooks-fetch'),
    mergeMap(
        () => fetchAllBooks(0).pipe(
            filter((res) => res.success),
            map((res): AppAction => {
                if (res.success) {
                    return {
                        type: 'allbooks-fulfilled',
                        payload: res.value.values,
                    };
                } else {
                    throw new Error('should not happen');
                }
            })
        ),
    ),
);

export const libraryEpic = combineEpics(
    fetchLibraryEpic,
    fetchAllBooksEpic,
);
