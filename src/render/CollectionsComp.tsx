import React from 'react';
import { LibraryCard } from 'booka-common';

import { Column } from '../atoms';
import { useTheme, useCollections, Themed } from '../application';
import { BookListComp } from './BookListComp';

export function CollectionsComp() {
    const { theme } = useTheme();

    const { collectionsState } = useCollections();
    const readingList = collectionsState.collections['reading-list'];

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
