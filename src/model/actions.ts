import { BookDesc } from "booka-common";

export type LibraryFetchAction = {
    type: 'LIBRARY_FETCH',
};

export type AllBooksFetchAction = {
    type: 'ALLBOOKS_FETCH',
    payload?: {
        page: number,
    },
};

export type AllBooksFulfilledAction = {
    type: 'ALLBOOKS_FULFILLED',
    payload: BookDesc[],
};

export type LibraryAction =
    | LibraryFetchAction | AllBooksFetchAction | AllBooksFulfilledAction
    ;

export type AppAction = LibraryAction;
