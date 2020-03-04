import {
    CardCollections, CardCollectionName, LibraryCard, replaceOrAdd,
} from 'booka-common';
import { AppAction } from './app';

export type CollectionsState = {
    collections: CardCollections,
};

type CollectionsAddCardAction = {
    type: 'collections-add-card',
    payload: {
        card: LibraryCard,
        collection: CardCollectionName,
    },
};
type CollectionRemoveCardAction = {
    type: 'collections-remove-card',
    payload: {
        card: LibraryCard,
        collection: CardCollectionName,
    },
};
type CollectionsReplaceAllAction = {
    type: 'collections-replace-all',
    payload: CardCollections,
};

export type CollectionsAction =
    | CollectionsAddCardAction | CollectionRemoveCardAction
    | CollectionsReplaceAllAction
    ;

const initial: CollectionsState = {
    collections: {},
};
export function collectionsReducer(state: CollectionsState = initial, action: AppAction): CollectionsState {
    switch (action.type) {
        case 'collections-add-card':
            return {
                ...state,
                collections: {
                    ...state.collections,
                    [action.payload.collection]: replaceOrAdd(
                        state.collections[action.payload.collection] ?? [],
                        c => c.id === action.payload.card.id,
                        action.payload.card,
                    ),
                },
            };
        case 'collections-remove-card':
            return {
                ...state,
                collections: {
                    ...state.collections,
                    [action.payload.collection]: (state.collections[action.payload.collection] ?? [])
                        .filter(c => c.id !== action.payload.card.id),
                },
            };
        case 'collections-replace-all':
            return { collections: action.payload };
        default:
            return state;
    }
}
