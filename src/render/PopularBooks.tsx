import React from 'react';

import { usePopularBooks, useTheme } from '../application';
import { GridList, Panel, ActivityIndicator } from '../controls';
import { LibraryCardTile } from './LibraryCardTile';

export function PopularBooks() {
    const { theme } = useTheme();
    const { popularBooksState } = usePopularBooks();
    if (popularBooksState.loading) {
        return <ActivityIndicator theme={theme} />;
    } else if (popularBooksState.length === 0) {
        return null;
    }

    return <Panel
        theme={theme}
        title='Popular'
    >
        <GridList theme={theme}>
            {
                popularBooksState.map(
                    (card, idx) =>
                        <LibraryCardTile
                            theme={theme}
                            key={idx}
                            card={card}
                        />,
                )
            }
        </GridList>
    </Panel>;
}
