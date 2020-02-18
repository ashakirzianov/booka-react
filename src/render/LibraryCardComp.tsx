import React from 'react';
import { LibraryCard, Callback } from 'booka-common';
import { BookCoverComp, Column, Modal, Themed } from '../atoms';

export type LibraryCardProps = Themed & {
    card: LibraryCard,
    toggleCard: Callback,
};
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
