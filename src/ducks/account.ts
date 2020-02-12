import { Epic, combineEpics } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { AuthToken, AccountInfo } from 'booka-common';
import { ofAppType } from './utils';
import { AppAction } from './app';
import { authFbToken, fetchAccountInfo } from '../api';

export type SignInProvider = 'facebook';
export type AccountStateNotSigned = {
    state: 'not-signed',
};
export type AccountStateSigned = {
    state: 'signed',
    provider: SignInProvider,
    account: AccountInfo,
    token: AuthToken,
};
export type AccountState =
    | AccountStateNotSigned | AccountStateSigned;
export type ReceivedFbTokenAction = {
    type: 'account-fb-token',
    payload: {
        token: string,
    },
};
export type AuthSuccessAction = {
    type: 'account-auth-success',
    payload: {
        provider: SignInProvider,
        token: AuthToken,
    },
};
export type ReceivedAccountInfoAction = {
    type: 'account-info',
    payload: {
        provider: SignInProvider,
        token: AuthToken,
        account: AccountInfo,
    },
};
export type LogoutAction = {
    type: 'account-logout',
};
export type AccountAction =
    | ReceivedFbTokenAction | AuthSuccessAction | ReceivedAccountInfoAction
    | LogoutAction
    ;

export function getAuthToken(state: AccountState): AuthToken | undefined {
    return state.state === 'signed'
        ? state.token
        : undefined;
}

const defaultState: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = defaultState, action: AppAction): AccountState {
    switch (action.type) {
        case 'account-info':
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
    ofAppType('account-fb-token'),
    mergeMap(
        action => authFbToken(action.payload.token).pipe(
            map((res): AppAction => {
                return {
                    type: 'account-auth-success',
                    payload: {
                        provider: 'facebook',
                        token: res.value,
                    },
                };
            }),
        ),
    ),
);

const accountAuthSuccessEpic: Epic<AppAction> = action$ => action$.pipe(
    ofAppType('account-auth-success'),
    mergeMap(
        action => fetchAccountInfo(action.payload.token).pipe(
            map((res): AppAction => {
                return {
                    type: 'account-info',
                    payload: {
                        account: res.value,
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
