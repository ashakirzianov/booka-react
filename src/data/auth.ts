import { AuthToken, BackContract } from 'booka-common';
import { config } from '../config';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);

export function authProvider() {
    return {
        getAuthTokenFromFbToken(token: string) {
            return back.get('/auth/fbtoken', {
                query: {
                    token,
                },
            });
        },
        getAccountInfo(token: AuthToken) {
            return back.get('/me/info', {
                auth: token.token,
            });
        },
    };
}
