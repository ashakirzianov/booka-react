import {
    Bookmark, Highlight, CardCollectionName, BookPath, CardCollection, LibraryCard,
} from 'booka-common';

type DefChange<K extends string> = {
    change: K,
};

type AddBookmarkChange = DefChange<'bookmark-add'> & {
    entity: Bookmark,
};
type RemoveBookmarkChange = DefChange<'bookmark-remove'> & {
    entityId: string,
};

type AddHighlightChange = DefChange<'highlight-add'> & {
    entity: Highlight,
};
type RemoveHighlightChange = DefChange<'highlight-remove'> & {
    entityId: string,
};

type AddToCollectionChange = DefChange<'collection-add'> & {
    card: LibraryCard,
    collection: CardCollectionName,
};
type RemoveFromCollectionChange = DefChange<'collection-remove'> & {
    bookId: string,
    collection: CardCollectionName,
};

type UpdateCurrentPositionChange = DefChange<'current-position-update'> & {
    bookId: string,
    path: BookPath,
};

export type Change =
    | AddBookmarkChange | RemoveBookmarkChange
    | AddHighlightChange | RemoveHighlightChange
    | AddToCollectionChange | RemoveFromCollectionChange
    | UpdateCurrentPositionChange
    ;

export const applyHighlightsChanges = makeApplyChanges<Highlight[]>((entities, change) => {
    switch (change.change) {
        case 'highlight-add':
            return [change.entity, ...entities];
        case 'highlight-remove':
            return entities.filter(e => e._id !== change.entityId);
        default:
            return entities;
    }
});

export const applyBookmarkChanges = makeApplyChanges<Bookmark[]>((entities, change) => {
    switch (change.change) {
        case 'bookmark-add':
            return [change.entity, ...entities];
        case 'bookmark-remove':
            return entities.filter(e => e._id !== change.entityId);
        default:
            return entities;
    }
});

// TODO: move to 'common'
export type CardCollections = {
    [n in CardCollectionName]?: CardCollection;
};
export const applyCollectionsChanges = makeApplyChanges<CardCollections>((collections, change) => {
    switch (change.change) {
        case 'collection-add': {
            return collections;
        }
        default:
            return collections;
    }
});

function makeApplyChanges<T>(fn: (t: T, change: Change) => T) {
    return (t: T, changes: Change[]): T => {
        return changes.reduce(
            fn, t,
        );
    };
}
