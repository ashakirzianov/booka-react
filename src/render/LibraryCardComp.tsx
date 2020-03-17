import React, { useCallback } from 'react';

import {
    LibraryCard, findPositions, CurrentPosition,
} from 'booka-common';
import { Column, Modal } from '../atoms';
import {
    useTheme, useLibraryCard,
    LibraryCardState, useCollections, usePositions,
} from '../application';
import { LinkToPath } from './Navigation';
import { BookCoverComp } from './BookListComp';

export function LibraryCardComp({ bookId }: {
    bookId: string,
}) {
    const { cardState, closeCard } = useLibraryCard(bookId);
    const { theme } = useTheme();
    const { positions } = usePositions();

    const {
        collectionsState: { collections },
        addToCollection,
        removeFromCollection,
    } = useCollections();
    const readingListCards = collections['reading-list'] ?? [];
    const addToReadingList = useCallback(
        (card: LibraryCard) => addToCollection(card, 'reading-list'),
        [addToCollection],
    );
    const removeFromReadingList = useCallback((card: LibraryCard) =>
        removeFromCollection(card.id, 'reading-list'),
        [removeFromCollection],
    );

    const currentPositions = positions.filter(
        p => p.bookId === bookId
    );
    const isInReadingList = readingListCards.find(c => c.id === bookId) !== undefined;
    const positionsData = findPositions(currentPositions);
    return <Modal
        theme={theme}
        close={closeCard}
        open={true}
    >
        <Column>
            <CardStateComp
                cardState={cardState}
                continueReadPosition={positionsData?.mostRecent}
                isInReadingList={isInReadingList}
                addToReadingList={addToReadingList}
                removeFromReadingList={removeFromReadingList}
            />
        </Column>
    </Modal>;
}

function CardStateComp({
    cardState, continueReadPosition,
    isInReadingList, addToReadingList, removeFromReadingList,
}: {
    cardState: LibraryCardState,
    continueReadPosition: CurrentPosition | undefined,
    isInReadingList: boolean,
    addToReadingList: (card: LibraryCard) => void,
    removeFromReadingList: (card: LibraryCard) => void,
}) {
    switch (cardState.state) {
        case 'loading':
            return <span>Loading...</span>;
        case 'error':
            return <span>Error: ${cardState.err}</span>;
        case 'ready':
            return <>
                <BookCoverComp card={cardState.card} />
                <span>{cardState.card.title}</span>
                <LinkToPath bookId={cardState.card.id}>Read from start</LinkToPath>
                {
                    continueReadPosition
                        ? <LinkToPath
                            bookId={cardState.card.id}
                            path={continueReadPosition.path}
                        >
                            Continue reading
                </LinkToPath>
                        : null
                }
                {
                    !isInReadingList
                        ? <span
                            onClick={
                                () => addToReadingList(cardState.card)
                            }>
                            Add to reading list
                </span>
                        : <span
                            onClick={
                                () => removeFromReadingList(cardState.card)
                            }
                        >
                            Remove from reading list
                </span>
                }
            </>;
        default:
            return <span>Unexpected</span>;
    }
}
