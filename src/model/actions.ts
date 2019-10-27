import { BookDesc, BookPositionLocator, BookFragment } from "booka-common";

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

export type AppAction =
    | LibraryAction | BookAction;
