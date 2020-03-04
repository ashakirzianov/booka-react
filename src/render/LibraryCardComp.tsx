import React from 'react';

import { LibraryCard, Callback } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed, navigate } from '../atoms';
import { useTheme, useAppDispatch, useAppSelector } from '../application';
import { linkToString } from '../core';

export function LibraryCardConnected() {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const showCard = useAppSelector(s => s.library.show);
    const collections = useAppSelector(s => s.collections.collections);
    const readingListCards = collections['reading-list'] ?? [];

    const closeCard = React.useCallback(() => dispatch({
        type: 'card-close',
    }), [dispatch]);

    const readFromStart = React.useCallback((bookId: string) => navigate(linkToString({
        link: 'book',
        bookId,
    })), []);

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

    if (showCard) {
        return <LibraryCardModal
            theme={theme}
            card={showCard}
            readingListCards={readingListCards}
            toggleCard={closeCard}
            readFromStart={readFromStart}
            addToReadingList={addToReadingList}
            removeFromReadingList={removeFromReadingList}
        />;
    } else {
        return null;
    }
}

type LibraryCardProps = Themed & {
    card: LibraryCard,
    readingListCards: LibraryCard[],
    toggleCard: Callback,
    readFromStart: Callback<string>,
    addToReadingList: Callback<LibraryCard>,
    removeFromReadingList: Callback<LibraryCard>,
};
function LibraryCardModal({
    theme, toggleCard, card, readingListCards,
    readFromStart, removeFromReadingList, addToReadingList,
}: LibraryCardProps) {
    const isInReadingList = readingListCards.find(c => c.id === card.id) !== undefined;
    return <Modal
        theme={theme}
        toggle={toggleCard}
        open={true}
    >
        <Column>
            <BookCoverComp {...card} />
            <span>{card.title}</span>
            <span onClick={() => readFromStart(card.id)}>Read</span>
            {
                !isInReadingList
                    ? <span onClick={() => addToReadingList(card)}>Add to reading list</span>
                    : <span onClick={() => removeFromReadingList(card)}>Remove from reading list</span>
            }

        </Column>
    </Modal>;
}
