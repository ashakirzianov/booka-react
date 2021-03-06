import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { SignState } from 'booka-common';
import { createDataProvider } from '../data';
import { SyncStorage } from '../core';
import { AppEpic, ofAppType, AppAction } from './app';
import { createSyncWorker } from './sync';

export type UserContext = ReturnType<typeof createUserContext>;
export function createUserContext(rootStorage: SyncStorage) {
    let current = createForSignState({ sign: 'not-signed' });
    function createForSignState(sign: SignState) {
        const userStorage = rootStorage.sub(
            sign.sign === 'signed' ? sign.accountInfo._id : 'default',
        );
        const dataProvider = createDataProvider({
            storage: userStorage.sub('data'),
            token: sign.sign === 'signed'
                ? sign.token : undefined,
        });
        const syncWorker = createSyncWorker({
            storage: userStorage.sub('sync'),
            dataProvider,
        });
        return { dataProvider, syncWorker };
    }
    return {
        setSignState(sign: SignState) {
            current = createForSignState(sign);
        },
        dataProvider() {
            return current.dataProvider;
        },
        syncWorker() {
            return current.syncWorker;
        },
    };
}

type DataUpdateProviderAction = {
    type: 'data/update-context',
};
export type DataAction =
    | DataUpdateProviderAction
    ;

const updateDataProviderEpic: AppEpic = (action$, _, { setSignState }) => action$.pipe(
    ofAppType('account/receive-info'),
    map(action => {
        setSignState({
            sign: 'signed',
            accountInfo: action.payload.account,
            token: action.payload.token,
        });
        return { type: 'data/update-context' };
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
