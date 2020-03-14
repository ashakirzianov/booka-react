import {
    AuthToken, BackContract, CardCollections,
    LibraryCard, CardCollectionName, replaceOrAdd,
} from 'booka-common';
import { config } from '../config';
import { LocalChange, connectedState } from './localChange';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
export function getCollections(token?: AuthToken) {
    const { subject, addChange, replaceState } = connectedState({}, applyChange);

    if (token) {
        back.get('/collections', {
            auth: token.token,
        }).subscribe(r => replaceState(r.value));
    }

    function add(card: LibraryCard, collection: CardCollectionName) {
        addChange({
            change: 'collection-add',
            card, collection,
        });
    }
    function remove(bookId: string, collection: CardCollectionName) {
        addChange({
            change: 'collection-remove',
            bookId, collection,
        });
    }

    return { observable: subject, add, remove };
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
