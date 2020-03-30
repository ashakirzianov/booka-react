import React from 'react';
import { LibraryCard, CardCollectionName } from 'booka-common';

import { Panel, ActivityIndicator } from '../controls';
import { useTheme, useCollection } from '../application';
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
    const { collectionsState } = useCollection(collection);

    return collectionsState.loading
        ? <ActivityIndicator theme={theme} />
        : <CardCollectionView
            theme={theme}
            displayName={title}
            cards={collectionsState.cards}
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
