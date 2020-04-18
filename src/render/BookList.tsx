import React from 'react';
import { LibraryCard } from 'booka-common';
import { Themed } from '../core';
import { LibraryCardLink } from './LibraryCardTile';

export function BookList({ books, theme }: Themed & {
    books: LibraryCard[],
    lines?: number,
}) {
    return <div style={{
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'scroll',
        justifyContent: 'flex-start',
    }}>
        {
            books.map((card, idx) =>
                <LibraryCardLink
                    key={idx}
                    theme={theme}
                    card={card}
                />,
            )
        }
    </div>;
}
