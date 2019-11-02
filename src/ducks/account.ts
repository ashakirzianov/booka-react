import { AppAction } from './app';
import { AuthToken, AccountInfo } from 'booka-common';
import { Epic, combineEpics } from 'redux-observable';
import { ofAppType } from './utils';
import { mergeMap, map } from 'rxjs/operators';
import { authFbToken, fetchAccountInfo } from '../api';

export type SignInProvider = 'facebook';
export type AccountStateNotSigned = {
    state: 'not-signed',
};
export type AccountStateSigned = {
    state: 'signed',
    provider: SignInProvider,
    token: AuthToken,
    userName: string,
    profilePictureUrl?: string,
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
    payload: AccountInfo,
};
export type AccountAction =
    | ReceivedFbTokenAction | AuthSuccessAction | ReceivedAccountInfoAction;

const defaultState: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = defaultState, action: AppAction): AccountState {
    switch (action.type) {
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
                    payload: res.value,
                };
            }),
        ),
    ),
);

export const accountEpic = combineEpics(
    accountFbTokenEpic,
    accountAuthSuccessEpic,
);
