import { LibContract, BookSearchResult } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const lib = createFetcher<LibContract>(config().libUrl);
export function search({ query }: {
    query: string | undefined,
}) {
    // TODO: should we handle it here ?
    if (!query) {
        return { observable: of<BookSearchResult[]>([]) };
    }
    const observable = lib.get('/search', {
        query: { query },
    }).pipe(
        map(res => res.value.values)
    );

    return { observable };
}
