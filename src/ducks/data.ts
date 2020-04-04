import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { SignState } from 'booka-common';
import { createDataProvider } from '../data';
import { AppEpic, ofAppType, AppAction } from './app';
import { createSyncWorker } from './sync';
import { Storage } from '../core';

export type DataAccess = ReturnType<typeof createDataAccess>;
export function createDataAccess(rootStorage: Storage) {
    const defaultStorage = rootStorage.sub('default');
    let dataProvider = createDataProvider({
        storage: defaultStorage,
        token: undefined,
    });
    let syncWorker = createSyncWorker({
        storage: defaultStorage,
        dataProvider,
    });
    return {
        setSignState(sign: SignState) {
            const userStorage = rootStorage.sub(
                sign.sign === 'signed' ? sign.accountInfo._id : 'default',
            );
            dataProvider = createDataProvider({
                storage: userStorage,
                token: sign.sign === 'signed'
                    ? sign.token : undefined,
            });
            syncWorker = createSyncWorker({
                storage: userStorage,
                dataProvider,
            });
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

const updateDataProviderEpic: AppEpic = (action$, _, { setSignState }) => action$.pipe(
    ofAppType('account-receive-info'),
    map(action => {
        setSignState({
            sign: 'signed',
            accountInfo: action.payload.account,
            token: action.payload.token,
        });
        return { type: 'data-provider-update' };
    }),
);

const syncEpic: AppEpic = (action$, _, { syncWorker }) => action$.pipe(
    mergeMap(action => {
        syncWorker().enqueue(action);
        return of<AppAction>();
    }),
);

export const dataEpic = combineEpics(
    updateDataProviderEpic,
    syncEpic,
);
