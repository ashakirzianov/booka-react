import {
    Bookmark, Highlight, CardCollectionName, BookPath,
} from 'booka-common';

type DefChange<K extends string> = {
    committable: K,
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
    bookId: string,
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
