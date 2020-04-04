import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { SignState } from 'booka-common';
import { createDataProvider } from '../data';
import { AppEpic, ofAppType, AppAction } from './app';
import { createSyncWorker } from './sync';

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
