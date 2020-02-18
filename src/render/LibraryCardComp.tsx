import React from 'react';
import { LibraryCard, Callback } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed, navigate } from '../atoms';
import { useTheme, useAppDispatch, useAppSelector, linkToString } from '../core';

export function LibraryCardConnected() {
    const dispatch = useAppDispatch();
    const card = useAppSelector(s => s.library.show);

    const closeCard = React.useCallback(() => dispatch({
        type: 'card-close',
    }), [dispatch]);

    const readFromStart = React.useCallback((bookId: string) => navigate(linkToString({
        link: 'book',
        bookId,
    })), []);

    const theme = useTheme();

    if (card) {
        return <LibraryCardModal
            theme={theme}
            card={card}
            toggleCard={closeCard}
            readFromStart={readFromStart}
        />;
    } else {
        return null;
    }
}

type LibraryCardProps = Themed & {
    card: LibraryCard,
    toggleCard: Callback,
    readFromStart: Callback<string>,
};
function LibraryCardModal({ theme, toggleCard, card, readFromStart }: LibraryCardProps) {
    return <Modal
        theme={theme}
        toggle={toggleCard}
        open={true}
    >
        <Column>
            <BookCoverComp {...card} />
            <span>{card.title}</span>
            <span onClick={() => readFromStart(card.id)}>Read</span>
        </Column>
    </Modal>;
}
