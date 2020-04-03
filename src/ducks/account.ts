import { combineEpics } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { AuthToken, AccountInfo } from 'booka-common';
import { createAuthApi } from '../data';
import { AppAction, ofAppType, AppEpic } from './app';

export type SignInProvider = 'facebook';
export type AccountState = {
    state: 'not-signed',
} | {
    state: 'signed',
    provider: SignInProvider,
    account: AccountInfo,
    token: AuthToken,
};
type ReceivedFbTokenAction = {
    type: 'account-receive-fb-token',
    payload: {
        token: string,
    },
};
type ReceivedAccountInfoAction = {
    type: 'account-receive-info',
    payload: {
        provider: SignInProvider,
        token: AuthToken,
        account: AccountInfo,
    },
};
type LogoutAction = {
    type: 'account-logout',
};
export type AccountAction =
    | ReceivedFbTokenAction | ReceivedAccountInfoAction
    | LogoutAction
    ;

const init: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = init, action: AppAction): AccountState {
    switch (action.type) {
        case 'account-receive-info':
            return {
                state: 'signed',
                account: action.payload.account,
                provider: action.payload.provider,
                token: action.payload.token,
            };
        case 'account-logout':
            return { state: 'not-signed' };
        default:
            return state;
    }
}

const accountFbTokenEpic: AppEpic = action$ => action$.pipe(
    ofAppType('account-receive-fb-token'),
    mergeMap(
        action => createAuthApi().getAuthTokenFromFbToken(action.payload.token).pipe(
            mergeMap(
                token => createAuthApi().getAccountInfo(token).pipe(
                    map((account): AppAction => {
                        return {
                            type: 'account-receive-info',
                            payload: {
                                account, token,
                                provider: 'facebook',
                            },
                        };
                    }),
                ),
            ),
        ),
    ),
);

export const accountEpic = combineEpics(
    accountFbTokenEpic,
);
