import { concat, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    AuthToken, CurrentPosition,
} from 'booka-common';
import { SyncStorage, persistentCache } from '../core';
import { backFetcher, optional } from './utils';

const back = backFetcher();

export function positionsProvider({ token, storage }: {
    storage: SyncStorage,
    token: AuthToken | undefined,
}) {
    const cache = persistentCache<CurrentPosition[]>(storage);
    return {
        getCurrentPositions() {
            return concat(
                of(cache.existing('default') ?? []),
                optional(token && back.get('/current-position', {
                    auth: token.token,
                }).pipe(
                    tap(ps => cache.add('default', ps)),
                )),
            );
        },
        postAddCurrentPosition(position: CurrentPosition) {
            return optional(token && back.put('/current-position', {
                auth: token.token,
                body: position,
            }));
        },
    };
}
