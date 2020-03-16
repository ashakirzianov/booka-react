import { switchMap } from 'rxjs/operators';
import {
    CardCollections, LibraryCard, CardCollectionName, replaceOrAdd,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { Api } from './api';

export function collectionsProvider(localChangeStore: LocalChangeStore, api: Api) {
    return {
        collections() {
            return api.getCollections().pipe(
                switchMap(cs => localChangeStore.observe({}, applyChange))
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

function applyChange(collections: CardCollections, change: LocalChange): CardCollections {
    switch (change.change) {
        case 'collection-add':
            return {
                ...collections,
                [change.collection]: replaceOrAdd(
                    collections[change.collection] ?? [],
                    c => c.id === change.card.id,
                    change.card,
                ),
            };
        case 'collection-remove':
            return {
                ...collections,
                [change.collection]: (collections[change.collection] ?? []).filter(c => c.id !== change.bookId),
            };
        default:
            return collections;
    }
}
