import { Observable, of } from 'rxjs';
import { LibContract, BackContract } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

export function optional<T>(observable?: Observable<T>): Observable<T> {
    return observable ?? of<T>();
}

export function libFetcher() {
    return createFetcher<LibContract>(config().libUrl);
}

export function backFetcher() {
    return createFetcher<BackContract>(config().backUrl);
}
