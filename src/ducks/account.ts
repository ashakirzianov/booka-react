import { Epic, combineEpics } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { AuthToken, AccountInfo } from 'booka-common';
import { AppAction, ofAppType } from './app';
import { createAuthApi } from '../data/api';

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
type AuthSuccessAction = {
    type: 'account-auth-success',
    payload: {
        provider: SignInProvider,
        token: AuthToken,
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
    | AuthSuccessAction
    | LogoutAction
    ;

const defaultState: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = defaultState, action: AppAction): AccountState {
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

const accountFbTokenEpic: Epic<AppAction> = action$ => action$.pipe(
    ofAppType('account-receive-fb-token'),
    mergeMap(
        action => createAuthApi().getAuthFbToken(action.payload.token).pipe(
            map((token): AppAction => {
                return {
                    type: 'account-auth-success',
                    payload: {
                        provider: 'facebook',
                        token,
                    },
                };
            }),
        ),
    ),
);

const accountAuthSuccessEpic: Epic<AppAction> = action$ => action$.pipe(
    ofAppType('account-auth-success'),
    mergeMap(
        action => createAuthApi().getAccountInfo(action.payload.token).pipe(
            map((account): AppAction => {
                return {
                    type: 'account-receive-info',
                    payload: {
                        account,
                        token: action.payload.token,
                        provider: action.payload.provider,
                    },
                };
            }),
        ),
    ),
);

export const accountEpic = combineEpics(
    accountFbTokenEpic,
    accountAuthSuccessEpic,
);
