import React from 'react';
import { BookTile, ActivityIndicator } from '../controls';
import { useLibraryCard, useTheme, Loadable, Themed } from '../application';
import { LibraryCard } from 'booka-common';

export function BookIdTile({ bookId }: {
    bookId: string,
}) {
    const { theme } = useTheme();
    const { card } = useLibraryCard(bookId);
    return <LoadableBookTile
        theme={theme}
        card={card}
    />;
}

// TODO: move to 'controls' ?
export function LoadableBookTile({ card, theme }: Themed & {
    card: Loadable<LibraryCard>,
}) {
    if (card.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <BookTile
            theme={theme}
            card={card}
        />;
    }
}
