import { BookPath } from 'booka-common';
import { AppAction } from './app';

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
