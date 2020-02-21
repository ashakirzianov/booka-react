import { CardCollection } from 'booka-common';
import { AppAction } from './app';

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

export type CollectionsAction =
    | CollectionsFetchAction | CollectionsFulfilledAction | CollectionsRejectedAction
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
