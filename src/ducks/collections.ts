import { map } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import {
    CardCollection, CardCollectionName, CardCollections, LibraryCard,
} from 'booka-common';
import { sameArrays } from '../utils';
import { AppAction } from './app';
import { sideEffectEpic, dataProviderEpic } from './helpers';
import { merge } from 'rxjs';

type CollectionsRequestAddAction = {
    type: 'collections-req-add',
    payload: {
        name: CardCollectionName,
        card: LibraryCard,
    },
};
type CollectionsRequestRemoveAction = {
    type: 'collections-req-remove',
    payload: {
        name: CardCollectionName,
        bookId: string,
    },
};
type CollectionsReceivedAction = {
    type: 'collections-received',
    payload: CardCollection,
};
export type CollectionsAction =
    | CollectionsRequestAddAction | CollectionsRequestRemoveAction
    | CollectionsReceivedAction
    ;

export type CollectionsState = CardCollections;
const init: CollectionsState = {};
export function collectionsReducer(state: CollectionsState = init, action: AppAction): CollectionsState {
    switch (action.type) {
        case 'collections-received': {
            const collection = state[action.payload.name];
            if (collection && sameArrays(collection, action.payload.cards)) {
                return state;
            } else {
                return {
                    ...state,
                    [action.payload.name]: action.payload.cards,
                };
            }
        }
        default:
            return state;
    }
}

const names: CardCollectionName[] = ['reading-list', 'uploads'];
const requestCollectionsEpic = dataProviderEpic(dp => merge(
    ...names.map(name => dp.collection(name).pipe(
        map((collection): AppAction => ({
            type: 'collections-received',
            payload: collection,
        })),
    )),
));
const requestCollectionsAddEpic = sideEffectEpic(
    'collections-req-add',
    ({ payload }, dp) =>
        dp.addToCollection(payload.card, payload.name),
);
const requestCollectionsRemoveEpic = sideEffectEpic(
    'collections-req-remove',
    ({ payload }, dp) =>
        dp.removeFromCollection(payload.bookId, payload.name),
);

export const collectionsEpic = combineEpics(
    requestCollectionsEpic,
    requestCollectionsAddEpic,
    requestCollectionsRemoveEpic,
);
