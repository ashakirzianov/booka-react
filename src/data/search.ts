import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibContract, BookSearchResult } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const lib = createFetcher<LibContract>(config().libUrl);
export function search({ query }: {
    query: string | undefined,
}) {
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
