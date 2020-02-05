import { BookPath } from 'booka-common';

export type RecentBookLocation = {
    path: BookPath,
    created: Date,
    preview?: string,
};

export type RecentBook = {
    id: string,
    locations: RecentBookLocation[],
};

export type RecentBooksState = {
    recentBooks: RecentBook[],
};

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
