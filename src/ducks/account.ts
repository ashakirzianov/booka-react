import { AppAction } from './app';
import { AuthToken } from 'booka-common';

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
export type AccountAction = ReceivedFbTokenAction;

const defaultState: AccountState = { state: 'not-signed' };
export function accountReducer(state: AccountState = defaultState, action: AppAction): AccountState {
    switch (action.type) {
        default:
            return state;
    }
}
