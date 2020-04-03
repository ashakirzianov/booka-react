import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { AppEpic, ofAppType } from './app';

type DataUpdateProviderAction = {
    type: 'data-provider-update',
};
export type DataAction =
    | DataUpdateProviderAction
    ;

const updateDataProviderEpic: AppEpic = (action$, _, deps) => action$.pipe(
    ofAppType('account-receive-info'),
    map(action => {
        deps.setSign({
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
