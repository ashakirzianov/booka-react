import React from 'react';
import { LibraryCard } from 'booka-common';

import { BookList, Column } from '../controls';
import { useTheme, useCollections, Themed } from '../application';

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

function CardCollectionComp({ theme, cards, displayName }: Themed & {
    cards: LibraryCard[] | undefined,
    displayName: string,
}) {
    if (!cards?.length) {
        return null;
    }

    return <Column>
        <span>{displayName}</span>
        <BookList theme={theme} books={cards} />
    </Column>;
}
