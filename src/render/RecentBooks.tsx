import React from 'react';
import {
    distinct,
} from 'booka-common';
import { usePositions, useTheme } from '../application';
import { GridList, Panel } from '../controls';
import { BookIdTile } from './LibraryCardTile';

export function RecentBooks() {
    const { theme } = useTheme();
    const { positions } = usePositions();
    if (positions.length === 0) {
        return null;
    }
    const sorted = positions.sort((l, r) => l.created > r.created ? -1 : 1);
    const unique = distinct(sorted, (l, r) => l.bookId === r.bookId);

    return <Panel
        theme={theme}
        title='Recent'
    >
        <GridList>
            {
                unique.map(
                    (pos, idx) =>
                        <BookIdTile
                            key={idx}
                            bookId={pos.bookId}
                        />
                )
            }
        </GridList>
    </Panel>;
}
