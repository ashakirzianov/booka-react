import { AuthToken } from 'booka-common';
import { backFetcher } from './utils';

const back = backFetcher();

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
