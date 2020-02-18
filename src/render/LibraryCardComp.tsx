import React from 'react';
import { LibraryCard, Callback } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed } from '../atoms';
import { useTheme, useAppDispatch, useAppSelector } from '../core';

export type LibraryCardProps = Themed & {
    card: LibraryCard,
    toggleCard: Callback,
};
export function LibraryCardConnected() {
    const dispatch = useAppDispatch();
    const card = useAppSelector(s => s.library.show);

    const closeCard = React.useCallback(() => dispatch({
        type: 'card-close',
    }), [dispatch]);

    const theme = useTheme();

    if (card) {
        return <LibraryCardModal
            theme={theme}
            card={card}
            toggleCard={closeCard}
        />;
    } else {
        return null;
    }
}

function LibraryCardModal({ theme, toggleCard, card }: LibraryCardProps) {
    return <Modal
        theme={theme}
        toggle={toggleCard}
        open={true}
    >
        <LibraryCardView {...card} />
    </Modal>;
}
function LibraryCardView(props: LibraryCard) {
    return <Column>
        <BookCoverComp {...props} />
        <span>{props.title}</span>
    </Column>;
}
