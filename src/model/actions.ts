import { BookDesc, BookPositionLocator, BookFragment } from "booka-common";

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

export type BookFragmentFetchAction = {
    type: 'fragment-fetch',
    payload: BookPositionLocator,
};
export type BookFragmentFulfilledAction = {
    type: 'fragment-fulfilled',
    payload: {
        locator: BookPositionLocator,
        fragment: BookFragment,
    },
};

export type BookAction =
    | BookFragmentFetchAction | BookFragmentFulfilledAction;

export type AppAction = LibraryAction;
