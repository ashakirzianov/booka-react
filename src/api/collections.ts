import {
    BackContract, AuthToken, CardCollection,
} from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const back = createFetcher<BackContract>(config().backUrl);
export function getCollections(token: AuthToken | undefined): Observable<CardCollection[]> {
    return token === undefined
        ? of([])
        : back.get('/collections', { auth: token.token }).pipe(
            map((res) => res.value)
        );
}
