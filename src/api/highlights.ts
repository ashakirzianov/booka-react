import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Highlight, BackContract, AuthToken,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

// TODO: be consistent with fetch results
const backFetcher = createFetcher<BackContract>(config().backUrl);
export function getHighlights(bookId: string, token?: AuthToken) {
    if (!token) {
        return of<Highlight[]>([]);
    } else {
        return backFetcher.get('/highlights', {
            auth: token.token,
            query: {
                bookId,
            },
        }).pipe(
            map(res => res.value)
        );
    }
}
