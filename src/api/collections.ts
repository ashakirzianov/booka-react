import {
    BackContract, AuthToken,
} from 'booka-common';
import { createFetcher } from './fetcher';
import { config } from '../config';

const back = createFetcher<BackContract>(config().backUrl);
export function fetchCollections(token: AuthToken) {
    return back.get('/collections', { auth: token.token });
}
