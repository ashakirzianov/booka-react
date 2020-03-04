import React from 'react';
import { CardCollections, Callback, LibraryCard } from 'booka-common';
import { Column, BookListComp, Themed } from '../atoms';

import { useAppDispatch, useTheme, useAppSelector } from '../application';

export function CollectionsConnected() {
    const dispatch = useAppDispatch();
    const collectionsState = useAppSelector(s => s.collections);

    const openCard = React.useCallback((card: LibraryCard) => dispatch({
        type: 'card-show',
        payload: card,
    }), [dispatch]);

    const theme = useTheme();

    return <CollectionsComp
        theme={theme}
        collections={collectionsState.collections}
        openCard={openCard}
    />;
}

function CollectionsComp({ collections, openCard, theme }: Themed & {
    collections: CardCollections,
    openCard: Callback<LibraryCard>,
}) {
    const readingList = collections['reading-list'];

    return <Column>
        <CardCollectionComp
            theme={theme}
            displayName='Reading List'
            cards={readingList}
            openCard={openCard}
        />
    </Column>;
}

function CardCollectionComp({ cards, displayName, openCard }: Themed & {
    cards: LibraryCard[] | undefined,
    displayName: string,
    openCard: Callback<LibraryCard>,
}) {
    if (!cards?.length) {
        return null;
    }

    return <Column>
        <span>{displayName}</span>
        <BookListComp
            books={cards}
            onClick={openCard}
        />
    </Column>;
}
