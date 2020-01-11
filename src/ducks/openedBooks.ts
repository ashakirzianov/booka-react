import { BookPath } from 'booka-common';

export type OpenedBookLocation = {
    path: BookPath,
    created: Date,
    preview?: string,
};

export type OpenedBook = {
    id: string,
    locations: OpenedBookLocation[],
};

export type OpenedBooksState = {
    openedBooks: OpenedBook[],
};
