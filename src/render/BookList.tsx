import React from 'react';
import { LibraryCard } from 'booka-common';
import { Themed } from '../core';
import { GridList } from '../controls';
import { LibraryCardLink } from './LibraryCardTile';

export function BookList({ books, theme }: Themed & {
    books: LibraryCard[],
    lines?: number,
}) {
    return <GridList
        theme={theme}
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
