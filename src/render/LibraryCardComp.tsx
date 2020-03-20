import React, { useCallback } from 'react';

import { LibraryCard } from 'booka-common';
import { Column, Modal } from '../atoms';
import {
    useTheme, useLibraryCard,
    useCollections, usePositions, mostRecentPosition,
} from '../application';
import { BookTile, BookPathLink } from '../controls';

export function LibraryCardComp({ bookId }: {
    bookId: string,
}) {
    const { card, closeCard } = useLibraryCard(bookId);
    const { theme } = useTheme();
    const { positions } = usePositions();

    const {
        collectionsState: { collections },
        addToCollection,
        removeFromCollection,
    } = useCollections();
    const readingListCards = collections['reading-list'] ?? [];
    const addToReadingList = useCallback(
        (c: LibraryCard) => addToCollection(c, 'reading-list'),
        [addToCollection],
    );
    const removeFromReadingList = useCallback((c: LibraryCard) =>
        removeFromCollection(c.id, 'reading-list'),
        [removeFromCollection],
    );

    const currentPositions = positions.filter(
        p => p.bookId === bookId
    );
    const isInReadingList = readingListCards.find(c => c.id === bookId) !== undefined;
    const continueReadPosition = mostRecentPosition(currentPositions);
    return <Modal
        theme={theme}
        close={closeCard}
        open={true}
    >
        <Column>
            <BookTile theme={theme} card={card} />
            <BookPathLink bookId={bookId}>Read from start</BookPathLink>
            {
                continueReadPosition
                    ? <BookPathLink
                        bookId={bookId}
                        path={continueReadPosition.path}
                    >
                        Continue reading
                </BookPathLink>
                    : null
            }
            {
                // TODO: extract ?
                card.loading ? null
                    : !isInReadingList
                        ? <span
                            onClick={
                                () => addToReadingList(card)
                            }>
                            Add to reading list
                </span>
                        : <span
                            onClick={
                                () => removeFromReadingList(card)
                            }
                        >
                            Remove from reading list
                </span>
            }
        </Column>
    </Modal>;
}
