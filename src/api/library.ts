import { LibContract } from 'booka-common';

import { config } from '../config';
import { createFetcher } from './fetcher';

const fetcher = createFetcher<LibContract>(config().libUrl);

export function fetchSearchQuery(query: string) {
    return fetcher.get('/search', {
        query: { query },
    });
}
