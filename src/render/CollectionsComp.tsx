import React from 'react';
import { CardCollection, Callback, LibraryCard, CardCollectionName } from 'booka-common';
import { Column, BookListComp, Themed } from '../atoms';

import { useAppDispatch, useTheme, useAppSelector } from '../core';

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
    collections: CardCollection[],
    openCard: Callback<LibraryCard>,
}) {
    const readingList = collectionForName(collections, 'reading-list');

    return <Column>
        <CardCollectionComp
            theme={theme}
            displayName='Reading List'
            collection={readingList}
            openCard={openCard}
        />
    </Column>;
}

function CardCollectionComp({ collection, displayName, openCard }: Themed & {
    collection: CardCollection | undefined,
    displayName: string,
    openCard: Callback<LibraryCard>,
}) {
    if (!collection?.cards?.length) {
        return null;
    }

    return <Column>
        <span>{displayName}</span>
        <BookListComp
            books={collection.cards}
            onClick={openCard}
        />
    </Column>;
}

function collectionForName(collections: CardCollection[], name: CardCollectionName): CardCollection | undefined {
    return collections.find(c => c.name === name);
}
