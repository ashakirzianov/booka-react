import { LibContract, BookPositionLocator } from 'booka-common';

import { config } from '../config';
import { createFetcher } from './fetcher';

const fetcher = createFetcher<LibContract>(config().libUrl);

export function fetchAllBooks(page: number) {
    return fetcher.get('/all', {
        query: { page },
    });
}

export function fetchBookFragment(location: BookPositionLocator) {
    return fetcher.get('/fragment', {
        body: location,
    });
}
