import React from 'react';
import { LibraryCard } from 'booka-common';
import { BookTile, ActivityIndicator } from '../controls';
import { useLibraryCard, useTheme, useSetLibraryCard } from '../application';
import { Themed, Loadable } from '../core';

export function BookIdTile({ bookId }: {
    bookId: string,
}) {
    const { theme } = useTheme();
    const card = useLibraryCard(bookId);
    return <LibraryCardLink
        theme={theme}
        card={card}
    />;
}

export function LibraryCardLink({ card, theme }: Themed & {
    card: Loadable<LibraryCard>,
}) {
    const openCard = useSetLibraryCard();
    if (card.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <BookTile
            theme={theme}
            title={card.title}
            author={card.author}
            coverUrl={card.coverUrl}
            callback={() => openCard(card.id)}
        />;
    }
}

export function LibraryCardTile({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    return <BookTile
        theme={theme}
        title={card.title}
        author={card.author}
        coverUrl={card.coverUrl}
        hideShadow={true}
    />;
}
