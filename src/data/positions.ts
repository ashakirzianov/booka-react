import { concat, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    AuthToken, CurrentPositionPost, CurrentPosition,
} from 'booka-common';
import { Storage, persistentCache } from '../core';
import { backFetcher, optional } from './utils';

const back = backFetcher();

export function positionsProvider({ token, storage }: {
    storage: Storage,
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
        postAddCurrentPosition(position: CurrentPositionPost) {
            return optional(token && back.put('/current-position', {
                auth: token.token,
                body: position,
            }));
        },
    };
}
