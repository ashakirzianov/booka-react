import React from 'react';
import { LibraryCard, CardCollectionName } from 'booka-common';

import { Panel } from '../controls';
import { useTheme, useCollections } from '../application';
import { Themed } from '../core';
import { BookList } from './BookList';

export function ReadingList() {
    return <CardCollection
        collection='reading-list'
        title='Reading List'
    />;
}

function CardCollection({ collection, title }: {
    collection: CardCollectionName,
    title: string,
}) {
    const { theme } = useTheme();

    const { collectionsState } = useCollections();
    const readingList = collectionsState.collections[collection];

    return <CardCollectionView
        theme={theme}
        displayName={title}
        cards={readingList}
    />;
}

function CardCollectionView({ theme, cards, displayName }: Themed & {
    cards: LibraryCard[] | undefined,
    displayName: string,
}) {
    if (!cards?.length) {
        return null;
    }

    return <Panel
        theme={theme}
        title={displayName}
    >
        <BookList theme={theme} books={cards} />
    </Panel>;
}
