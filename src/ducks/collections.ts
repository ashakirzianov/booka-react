import { CardCollection } from 'booka-common';

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
