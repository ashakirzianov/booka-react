import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppEpic, ofAppType } from './app';
import { createDataProvider } from '../data';
import { createSyncWorker } from './sync';
import { SignState } from 'booka-common';

export type DataAccess = ReturnType<typeof createDataAccess>;
export function createDataAccess() {
    let dataProvider = createDataProvider({ sign: 'not-signed' });
    let syncWorker = createSyncWorker(dataProvider);
    return {
        setSignState(sign: SignState) {
            dataProvider = createDataProvider(sign);
            syncWorker = createSyncWorker(dataProvider);
        },
        dataProvider() {
            return dataProvider;
        },
        syncWorker() {
            return syncWorker;
        },
    };
}

type DataUpdateProviderAction = {
    type: 'data-provider-update',
};
export type DataAction =
    | DataUpdateProviderAction
    ;

const updateDataProviderEpic: AppEpic = (action$, _, deps) => action$.pipe(
    ofAppType('account-receive-info'),
    map(action => {
        deps.setSignState({
            sign: 'signed',
            accountInfo: action.payload.account,
            token: action.payload.token,
        });
        return { type: 'data-provider-update' };
    }),
);

export const dataEpic = combineEpics(
    updateDataProviderEpic,
);
