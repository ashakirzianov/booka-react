import React from 'react';
import { LibraryCard } from 'booka-common';

import { Column, Panel } from '../controls';
import { useTheme, useCollections, Themed } from '../application';
import { BookList } from './BookList';

export function Collections() {
    const { theme } = useTheme();

    const { collectionsState } = useCollections();
    const readingList = collectionsState.collections['reading-list'];

    return <Column>
        <CardCollection
            theme={theme}
            displayName='Reading List'
            cards={readingList}
        />
    </Column>;
}

function CardCollection({ theme, cards, displayName }: Themed & {
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
