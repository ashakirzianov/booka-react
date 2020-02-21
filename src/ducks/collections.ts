import { LibraryCard } from 'booka-common';

export type BookCollection = {
    tag: string,
    displayName: string,
    cards: LibraryCard[],
};
export type CollectionsState = {
    collections: BookCollection[],
};
