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
