import React from 'react';
import { LibraryCard } from 'booka-common';
import { BookCoverComp, Column } from '../atoms';

export type LibraryCardProps = {
    card: LibraryCard,
};
export function LibraryCardComp({ card }: LibraryCardProps) {
    return <Column>
        <BookCoverComp {...card} />
        <span>{card.title}</span>
    </Column>;
}
