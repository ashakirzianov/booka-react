import { LibContract } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';
import { map } from 'rxjs/operators';

const lib = createFetcher<LibContract>(config().libUrl);
export function search({ query }: {
    query: string,
}) {
    const observable = lib.get('/search', {
        query: { query },
    }).pipe(
        map(res => res.value.values)
    );

    return { observable };
}