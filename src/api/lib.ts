import {
    LibContract, BookPositionLocator,
    pathToString,
    BookPath,
} from 'booka-common';

import { config } from '../config';
import { createFetcher } from './fetcher';

const fetcher = createFetcher<LibContract>(config().libUrl);

export function fetchAllBooks(page: number) {
    return fetcher.get('/all', {
        query: { page },
    });
}

export function fetchBookFragment(id: string, path: BookPath) {
    return fetcher.get('/fragment', {
        query: {
            id,
            path: pathToString(path),
        },
    });
}

export function fetchBook(id: string) {
    return fetcher.get('/full', {
        query: { id },
    });
}
