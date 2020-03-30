import { switchMap } from 'rxjs/operators';
import {
    CardCollection, LibraryCard,
    CardCollectionName, replaceOrAdd,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { Api } from './api';

export function collectionsProvider(localChangeStore: LocalChangeStore, api: Api) {
    return {
        collection(name: CardCollectionName) {
            return api.getCollection(name).pipe(
                switchMap(c => localChangeStore.observe(c, applyChange)),
            );
        },
        addToCollection(card: LibraryCard, collection: CardCollectionName) {
            localChangeStore.addChange({
                change: 'collection-add',
                card, collection,
            });
        },
        removeFromCollection(bookId: string, collection: CardCollectionName) {
            localChangeStore.addChange({
                change: 'collection-remove',
                bookId, collection,
            });
        },
    };
}

function applyChange(collection: CardCollection, change: LocalChange): CardCollection {
    switch (change.change) {
        case 'collection-add':
            return change.collection === collection.name
                ? {
                    ...collection,
                    cards: replaceOrAdd(
                        collection.cards,
                        c => c.id === change.card.id,
                        change.card,
                    ),
                }
                : collection;
        case 'collection-remove':
            return change.collection === collection.name
                ? {
                    ...collection,
                    cards: collection.cards.filter(c => c.id !== change.bookId),
                }
                : collection;
        default:
            return collection;
    }
}
