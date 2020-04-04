import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
    CardCollection, CardCollectionName, CardCollections, LibraryCard,
} from 'booka-common';
import { AppAction } from './app';
import { dataProviderEpic } from './helpers';

type CollectionsAddAction = {
    type: 'collections-add',
    payload: {
        name: CardCollectionName,
        card: LibraryCard,
    },
};
type CollectionsRemoveAction = {
    type: 'collections-remove',
    payload: {
        name: CardCollectionName,
        bookId: string,
    },
};
type CollectionsReplaceAction = {
    type: 'collections-replace',
    payload: CardCollection,
};
export type CollectionsAction =
    | CollectionsAddAction | CollectionsRemoveAction
    | CollectionsReplaceAction
    ;

export type CollectionsState = CardCollections;
const init: CollectionsState = {};
export function collectionsReducer(state: CollectionsState = init, action: AppAction): CollectionsState {
    switch (action.type) {
        case 'collections-add': {
            const cards = state[action.payload.name] ?? [];
            if (cards.find(c => c.id === action.payload.card.id)) {
                return state;
            } else {
                return {
                    ...state,
                    [action.payload.name]: [action.payload.card, ...cards],
                };
            }
        }
        case 'collections-remove': {
            const cards = state[action.payload.name] ?? [];
            if (cards.find(c => c.id === action.payload.bookId)) {
                return {
                    ...state,
                    [action.payload.name]: cards
                        .filter(c => c.id !== action.payload.bookId),
                };
            } else {
                return state;
            }
        }
        case 'collections-replace': {
            return {
                ...state,
                [action.payload.name]: action.payload.cards,
            };
        }
        default:
            return state;
    }
}

const names: CardCollectionName[] = ['reading-list', 'uploads'];
const requestCollectionsEpic = dataProviderEpic((dp, sync) => merge(
    ...names.map(name => dp.getCollection(name).pipe(
        map(c => {
            const withLocalChanges = sync.reduce({ [c.name]: c }, collectionsReducer);
            return {
                name: c.name,
                cards: withLocalChanges[c.name] ?? [],
            };
        }),
        map((collection): AppAction => ({
            type: 'collections-replace',
            payload: collection,
        })),
    )),
));

export const collectionsEpic = combineEpics(
    requestCollectionsEpic,
);
