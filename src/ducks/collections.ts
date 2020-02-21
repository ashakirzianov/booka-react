import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map } from 'rxjs/operators';
import { combineEpics, Epic } from 'redux-observable';
import { CardCollection, CardCollectionName } from 'booka-common';
import { getCollections, postAddToCollection } from '../api';
import { AppAction, AppState } from './app';
import { ofAppType } from './utils';
import { getAuthToken } from './account';

export type CollectionsState = {
    collections: CardCollection[],
};

type CollectionsFetchAction = {
    type: 'collections-fetch',
};
type CollectionsFulfilledAction = {
    type: 'collections-fulfilled',
    payload: CardCollection[],
};
type CollectionsRejectedAction = {
    type: 'collections-rejected',
    payload?: any,
};
type AddToCollectionAction = {
    type: 'collections-add',
    payload: {
        bookId: string,
        collection: CardCollectionName,
    },
};

export type CollectionsAction =
    | CollectionsFetchAction | CollectionsFulfilledAction | CollectionsRejectedAction
    | AddToCollectionAction
    ;

const initial: CollectionsState = {
    collections: [],
};
export function collectionsReducer(state: CollectionsState = initial, action: AppAction): CollectionsState {
    switch (action.type) {
        case 'collections-fulfilled':
            return {
                collections: action.payload,
            };
        default:
            return state;
    }
}

const fetchEpic: Epic<AppAction> = action$ => action$.pipe(
    ofAppType('account-info'),
    mergeMap(
        action => of<AppAction>({
            type: 'collections-fetch',
        }),
    ),
);

const processFetchEpic: Epic<AppAction, AppAction, AppState> = (action$, state$) =>
    action$.pipe(
        ofAppType('collections-fetch'),
        withLatestFrom(state$),
        mergeMap(
            ([_, state]) => getCollections(getAuthToken(state.account)).pipe(
                map((res): AppAction => {
                    return {
                        type: 'collections-fulfilled',
                        payload: res,
                    };
                }),
            ),
        ),
    );

const addToCollectionEpic: Epic<AppAction, AppAction, AppState> =
    (action$, state$) => action$.pipe(
        ofAppType('collections-add'),
        withLatestFrom(state$),
        mergeMap(([{ payload }, state]) => {
            const token = getAuthToken(state.account);
            if (token !== undefined) {
                postAddToCollection(payload.bookId, payload.collection, token)
                    .subscribe();
            }
            return of<AppAction>();
        }),
    );

export const collectionsEpic = combineEpics(
    fetchEpic,
    processFetchEpic,
);
