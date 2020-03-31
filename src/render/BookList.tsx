import React from 'react';
import { LibraryCard } from 'booka-common';
import { Themed } from '../core';
import { GridList, bookCoverHeight } from '../controls';
import { LibraryCardLink } from './LibraryCardTile';

export function BookList({ books, lines, theme }: Themed & {
    books: LibraryCard[],
    lines?: number,
}) {
    return <GridList
        theme={theme}
        // TODO: Rethink this truly terrible solution
        maxHeight={
            lines
                ? (lines + 1) * bookCoverHeight
                : undefined
        }
    >
        {
            books.map((card, idx) =>
                <LibraryCardLink
                    key={idx}
                    theme={theme}
                    card={card}
                />,
            )
        }
    </GridList>;
}
