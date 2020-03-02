import React from 'react';

import { LibraryCard, Callback } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed, navigate } from '../atoms';
import { useTheme, useAppDispatch, useAppSelector } from '../application';
import { linkToString } from '../core';

export function LibraryCardConnected() {
    const dispatch = useAppDispatch();
    const showCard = useAppSelector(s => s.library.show);

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

    const theme = useTheme();

    if (showCard) {
        return <LibraryCardModal
            theme={theme}
            card={showCard}
            toggleCard={closeCard}
            readFromStart={readFromStart}
            addToReadingList={addToReadingList}
        />;
    } else {
        return null;
    }
}

type LibraryCardProps = Themed & {
    card: LibraryCard,
    toggleCard: Callback,
    readFromStart: Callback<string>,
    addToReadingList: Callback<LibraryCard>,
};
function LibraryCardModal({
    theme, toggleCard, card, readFromStart, addToReadingList,
}: LibraryCardProps) {
    return <Modal
        theme={theme}
        toggle={toggleCard}
        open={true}
    >
        <Column>
            <BookCoverComp {...card} />
            <span>{card.title}</span>
            <span onClick={() => readFromStart(card.id)}>Read</span>
            <span onClick={() => addToReadingList(card)}>Add to reading list</span>
        </Column>
    </Modal>;
}
