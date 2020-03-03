import { CardCollection, CardCollectionName, LibraryCard } from 'booka-common';
import { AppAction } from './app';
import { replaceOrAdd } from './utils';

// TODO: move to 'common'
export type CardCollections = {
    [n in CardCollectionName]?: CardCollection;
};

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
                    [action.payload.collection]: {
                        name: action.payload.collection,
                        cards: replaceOrAdd(
                            state.collections[action.payload.collection]?.cards ?? [],
                            c => c.id === action.payload.card.id,
                            action.payload.card,
                        ),
                    },
                },
            };
        case 'collections-remove-card':
            return {
                ...state,
                collections: {
                    ...state.collections,
                    [action.payload.collection]: {
                        name: action.payload.collection,
                        cards: (state.collections[action.payload.collection]?.cards ?? [])
                            .filter(c => c.id !== action.payload.card.id),
                    },
                },
            };
        case 'collections-replace-all':
            return { collections: action.payload };
        default:
            return state;
    }
}
