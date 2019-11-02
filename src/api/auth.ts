import { createFetcher } from './fetcher';
import { BackContract, AuthToken } from 'booka-common';
import { config } from '../config';

const fetcher = createFetcher<BackContract>(config().backUrl);

export function authFbToken(token: string) {
    return fetcher.get('/auth/fbtoken', {
        query: {
            token,
        },
    });
}

export function fetchAccountInfo(token: AuthToken) {
    return fetcher.get('/me/info', {
        auth: token.token,
    });
}
