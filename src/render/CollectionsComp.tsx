import React from 'react';
import { CardCollections, LibraryCard } from 'booka-common';
import { Column, Themed } from '../atoms';
import { BookListComp } from './BookList';

import { useTheme, useAppSelector } from '../application';

export function CollectionsConnected() {
    const collectionsState = useAppSelector(s => s.collections);

    const theme = useTheme();

    return <CollectionsComp
        theme={theme}
        collections={collectionsState.collections}
    />;
}

function CollectionsComp({ collections, theme }: Themed & {
    collections: CardCollections,
}) {
    const readingList = collections['reading-list'];

    return <Column>
        <CardCollectionComp
            theme={theme}
            displayName='Reading List'
            cards={readingList}
        />
    </Column>;
}

function CardCollectionComp({ cards, displayName }: Themed & {
    cards: LibraryCard[] | undefined,
    displayName: string,
}) {
    if (!cards?.length) {
        return null;
    }

    return <Column>
        <span>{displayName}</span>
        <BookListComp books={cards} />
    </Column>;
}
