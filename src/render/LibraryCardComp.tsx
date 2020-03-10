import React from 'react';

import { LibraryCard, Callback, BookPath, getLocationsData, ResolvedCurrentPosition } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed } from '../atoms';
import { useTheme, useAppDispatch, useAppSelector } from '../application';

export function LibraryCardConnected() {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const showCard = useAppSelector(s => s.library.show);
    const collections = useAppSelector(s => s.collections.collections);
    const { positions } = useAppSelector(s => s.currentPositions);
    const readingListCards = collections['reading-list'] ?? [];

    const closeCard = React.useCallback(() => dispatch({
        type: 'card-close',
    }), [dispatch]);

    // TODO: implement
    const readFromPath = React.useCallback((bookId: string, path?: BookPath) => undefined, []);

    const addToReadingList = React.useCallback((card: LibraryCard) => dispatch({
        type: 'collections-add-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);
    const removeFromReadingList = React.useCallback((card: LibraryCard) => dispatch({
        type: 'collections-remove-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);

    const currentPosition = positions.find(
        p => p.card.id === showCard?.id
    );

    if (showCard) {
        return <LibraryCardModal
            theme={theme}
            card={showCard}
            readingListCards={readingListCards}
            currentPosition={currentPosition}
            toggleCard={closeCard}
            readFromPath={readFromPath}
            addToReadingList={addToReadingList}
            removeFromReadingList={removeFromReadingList}
        />;
    } else {
        return null;
    }
}

function LibraryCardModal({
    theme, toggleCard, card, readingListCards, currentPosition,
    readFromPath, removeFromReadingList, addToReadingList,
}: Themed & {
    card: LibraryCard,
    readingListCards: LibraryCard[],
    currentPosition: ResolvedCurrentPosition | undefined,
    toggleCard: Callback,
    readFromPath: (bookId: string, path?: BookPath) => void,
    addToReadingList: Callback<LibraryCard>,
    removeFromReadingList: Callback<LibraryCard>,
}) {
    const isInReadingList = readingListCards.find(c => c.id === card.id) !== undefined;
    const locationsData = currentPosition && getLocationsData(currentPosition);
    const continueReadPosition = locationsData?.mostRecent;
    return <Modal
        theme={theme}
        toggle={toggleCard}
        open={true}
    >
        <Column>
            <BookCoverComp card={card} />
            <span>{card.title}</span>
            <span onClick={() => readFromPath(card.id)}>Read from start</span>
            {
                continueReadPosition
                    ? <span onClick={() => readFromPath(card.id, continueReadPosition.path)}>Continue reading</span>
                    : null
            }
            {
                !isInReadingList
                    ? <span onClick={() => addToReadingList(card)}>Add to reading list</span>
                    : <span onClick={() => removeFromReadingList(card)}>Remove from reading list</span>
            }

        </Column>
    </Modal>;
}
