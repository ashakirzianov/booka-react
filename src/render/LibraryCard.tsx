import React, { useCallback } from 'react';

import {
    LibraryCard, getLocationsData, BookPositionData,
} from 'booka-common';
import { Column, Modal } from '../atoms';
import {
    useTheme, useAppDispatch, useAppSelector, useLibraryCardData, LibraryCardState,
} from '../application';
import { LinkToPath, useUrlActions } from './Navigation';
import { BookCoverComp } from './BookList';

export function LibraryCardComp({ bookId }: {
    bookId: string,
}) {
    const cardState = useLibraryCardData(bookId);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const collections = useAppSelector(s => s.collections.collections);
    const { positions } = useAppSelector(s => s.currentPositions);
    const readingListCards = collections['reading-list'] ?? [];

    const addToReadingList = useCallback((card: LibraryCard) => dispatch({
        type: 'collections-add-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);
    const removeFromReadingList = useCallback((card: LibraryCard) => dispatch({
        type: 'collections-remove-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);

    const { updateShowCard } = useUrlActions();
    const closeCard = useCallback(
        () => updateShowCard(undefined),
        [updateShowCard],
    );

    const currentPosition = positions.find(
        p => p.card.id === bookId
    );
    const isInReadingList = readingListCards.find(c => c.id === bookId) !== undefined;
    const locationsData = currentPosition && getLocationsData(currentPosition);
    return <Modal
        theme={theme}
        close={closeCard}
        open={true}
    >
        <Column>
            <CardStateComp
                cardState={cardState}
                continueReadPosition={locationsData?.mostRecent}
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
    continueReadPosition: BookPositionData | undefined,
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
