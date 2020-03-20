import React from 'react';
import {
    distinct,
} from 'booka-common';
import { usePositions, useTheme } from '../application';
import { GridList, TitledPanel } from '../controls';
import { BookIdTile } from './LoadableBookTile';

export function RecentBooksComp() {
    const { theme } = useTheme();
    const { positions } = usePositions();
    if (positions.length === 0) {
        return null;
    }
    const sorted = positions.sort((l, r) => l.created > r.created ? -1 : 1);
    const unique = distinct(sorted, (l, r) => l.bookId === r.bookId);

    return <TitledPanel
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
    </TitledPanel>;
}
