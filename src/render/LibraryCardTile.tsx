import React from 'react';
import { BookTile, ActivityIndicator, ShowCardLink } from '../controls';
import { useLibraryCard, useTheme, Loadable, Themed } from '../application';
import { LibraryCard } from 'booka-common';

export function BookIdTile({ bookId }: {
    bookId: string,
}) {
    const { theme } = useTheme();
    const { card } = useLibraryCard(bookId);
    return <LibraryCardTile
        theme={theme}
        card={card}
    />;
}

export function LibraryCardTile({ card, theme }: Themed & {
    card: Loadable<LibraryCard>,
}) {
    if (card.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <ShowCardLink bookId={card.id}>
            <BookTile
                theme={theme}
                title={card.title}
                author={card.author}
                coverUrl={card.coverUrl}
            />
        </ShowCardLink>;
    }
}
