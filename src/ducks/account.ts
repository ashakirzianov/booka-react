import { combineEpics } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { AuthToken, AccountInfo } from 'booka-common';
import { AppAction, ofAppType, AppEpic } from './app';

type ReceivedFbTokenAction = {
    type: 'account/receive-fb-token',
    payload: {
        token: string,
    },
};
type ReceivedAccountInfoAction = {
    type: 'account/receive-info',
    payload: {
        provider: SignInProvider,
        token: AuthToken,
        account: AccountInfo,
    },
};
type LogoutAction = {
    type: 'account/logout',
};
export type AccountAction =
    | ReceivedFbTokenAction | ReceivedAccountInfoAction
    | LogoutAction
    ;

export type SignInProvider = 'facebook';
export type AccountState = {
    state: 'not-signed',
} | {
    state: 'signed',
    provider: SignInProvider,
    account: AccountInfo,
    token: AuthToken,
};

const init: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = init, action: AppAction): AccountState {
    switch (action.type) {
        case 'account/receive-info':
            return {
                state: 'signed',
                account: action.payload.account,
                provider: action.payload.provider,
                token: action.payload.token,
            };
        case 'account/logout':
            return { state: 'not-signed' };
        default:
            return state;
    }
}

const accountFbTokenEpic: AppEpic = (action$, _, { dataProvider }) => action$.pipe(
    ofAppType('account/receive-fb-token'),
    mergeMap(
        action => dataProvider().getAuthTokenFromFbToken(action.payload.token).pipe(
            mergeMap(
                token => dataProvider().getAccountInfo(token).pipe(
                    map((account): AppAction => {
                        return {
                            type: 'account/receive-info',
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
