import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    BackContract, AuthToken, BookPath, EntitySource,
    ResolvedCurrentPosition,
} from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';

const back = createFetcher<BackContract>(config().backUrl);

export function getCurrentPositions(token: AuthToken): Observable<ResolvedCurrentPosition[]> {
    return back.get('/current-position', {
        auth: token.token,
    }).pipe(
        map(res => res.value),
    );
}

export function sendCurrentPathUpdate({ bookId, path, source, token }: {
    bookId: string,
    path: BookPath,
    source: EntitySource,
    token: AuthToken,
}) {
    const created = new Date(Date.now());
    return back.put('/current-position', {
        auth: token.token,
        body: {
            source, bookId, path, created,
        },
    });
}
