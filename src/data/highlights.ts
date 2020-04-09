import { of, concat } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthToken, Highlight, HighlightUpdate } from 'booka-common';
import { backFetcher, optional } from './utils';
import { persistentCache, SyncStorage } from '../core';

const back = backFetcher();

export function highlightsProvider({ storage, token }: {
    storage: SyncStorage,
    token: AuthToken | undefined,
}) {
    const cache = persistentCache<Highlight[]>(storage);
    return {
        getHighlights(bookId: string) {
            return concat(
                of(cache.existing(bookId) ?? []),
                optional(token && back.get('/highlights', {
                    auth: token.token,
                    query: { bookId },
                }).pipe(
                    tap(hs => cache.add(bookId, hs)),
                )),
            );
        },
        postAddHighlight(highlight: Highlight) {
            return optional(token && back.post('/highlights', {
                auth: token.token,
                body: highlight,
            }));
        },
        postRemoveHighlight(highlightId: string) {
            return optional(token && back.delete('/highlights', {
                auth: token.token,
                query: { highlightId },
            }));
        },
        postUpdateHighlight(update: HighlightUpdate) {
            return optional(token && back.patch('/highlights', {
                auth: token.token,
                body: update,
            }));
        },
    };
}
