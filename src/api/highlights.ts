import { map } from 'rxjs/operators';
import {
    BackContract, AuthToken, HighlightPost, HighlightUpdate,
} from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const backFetcher = createFetcher<BackContract>(config().backUrl);
export function getHighlights(bookId: string, token: AuthToken) {
    return backFetcher.get('/highlights', {
        auth: token.token,
        query: {
            bookId,
        },
    }).pipe(
        map(res => res.value)
    );
}

export function postHighlight(highlight: HighlightPost, token: AuthToken) {
    return backFetcher.post('/highlights', {
        auth: token.token,
        body: highlight,
    });
}

export function postHighlightUpdate(highlight: HighlightUpdate, token: AuthToken) {
    return backFetcher.patch('/highlights', {
        auth: token.token,
        body: highlight,
    });
}
